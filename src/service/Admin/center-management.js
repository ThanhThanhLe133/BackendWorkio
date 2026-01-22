import {
    CenterRepository,
    CourseRepository,
    CandidateRepository,
} from "../../repository/index.js";
import { UserRepository, AddressRepository } from "../../repository/index.js";
import { hashPassword } from "../../helpers/fn.js";
import db from "../../models/index.js";

export const getCenterDetailAdmin = (center_id) =>
    new Promise(async (resolve) => {
        try {
            const repo = new CenterRepository();
            const center = await repo.getCenterById(center_id);
            if (!center) return resolve({ err: 1, mes: "Không tìm thấy trung tâm" });
            resolve({
                err: 0,
                mes: "Lấy chi tiết trung tâm thành công",
                data: center,
            });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getAllCentersAdmin = (filters = {}) =>
    new Promise(async (resolve) => {
        try {
            const repo = new CenterRepository();
            const centers = await repo.getAll(filters);
            resolve({
                err: 0,
                mes: "Lấy danh sách trung tâm thành công",
                data: centers || [],
            });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const createCenterAdmin = ({
    email,
    password,
    centerInfo = {},
    addressInfo = {},
}) =>
    new Promise(async (resolve) => {
        const transaction = await db.sequelize.transaction();
        try {
            const userRepo = new UserRepository();
            const centerRepo = new CenterRepository();
            const addressRepo = new AddressRepository();

            const existingUser = await userRepo.getByEmail(email);
            if (existingUser) {
                await transaction.rollback();
                return resolve({ err: 1, mes: "Email này đã được đăng ký" });
            }

            const role = await userRepo.getRole("Center");
            const user = await userRepo.createUser(
                {
                    email,
                    password: hashPassword(password),
                    role_id: role.id,
                },
                transaction,
            );

            let address_id = null;
            if (addressInfo && Object.keys(addressInfo).length > 0) {
                const normalizedAddress = {
                    street: addressInfo.street,
                    ward_code: addressInfo.ward_code ?? addressInfo.ward,
                    province_code: addressInfo.province_code,
                };
                const address = await addressRepo.create(
                    normalizedAddress,
                    transaction,
                );
                address_id = address.id;
            }

            await centerRepo.createCenter(
                {
                    center_id: user.id,
                    address_id,
                    email,
                    ...centerInfo,
                },
                transaction,
            );

            await transaction.commit();
            resolve({ err: 0, mes: "Tạo trung tâm thành công" });
        } catch (error) {
            await transaction.rollback();
            resolve({ err: 1, mes: error.message });
        }
    });

export const getCenterCoursesAdmin = (center_id) =>
    new Promise(async (resolve) => {
        try {
            if (!center_id) return resolve({ err: 1, mes: "Missing center_id" });
            const courseRepo = new CourseRepository();
            const courses = await courseRepo.getByCenterId(center_id);

            // Enrich course.candidates với thông tin tên học viên để FE hiển thị "Thông tin học viên"
            let enrichedCourses = courses || [];
            if (Array.isArray(courses) && courses.length) {
                // Thu thập tất cả candidate_id xuất hiện trong các khóa học
                const idSet = new Set();
                for (const course of courses) {
                    const json = course.toJSON ? course.toJSON() : course;
                    const list = Array.isArray(json.candidates) ? json.candidates : [];
                    for (const item of list) {
                        if (item && item.candidate_id) {
                            idSet.add(item.candidate_id);
                        }
                    }
                }

                if (idSet.size > 0) {
                    const candidateRepo = new CandidateRepository();
                    const basicCandidates = await candidateRepo.getBasicByIds([...idSet]);
                    const map = new Map();
                    for (const c of basicCandidates) {
                        const json = c.toJSON ? c.toJSON() : c;
                        map.set(json.candidate_id, json);
                    }

                    enrichedCourses = courses.map((course) => {
                        const json = course.toJSON ? course.toJSON() : course;
                        const list = Array.isArray(json.candidates) ? json.candidates : [];
                        json.candidates = list.map((item) => {
                            const info = map.get(item.candidate_id);
                            const candidateName =
                                info?.full_name || info?.candidate?.name || null;
                            return {
                                ...item,
                                candidate_name: candidateName,
                            };
                        });
                        return json;
                    });
                } else {
                    enrichedCourses = courses.map((course) =>
                        course.toJSON ? course.toJSON() : course,
                    );
                }
            }

            resolve({
                err: 0,
                mes: "Lấy khóa học của trung tâm thành công",
                data: enrichedCourses,
            });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateCenterAdmin = ({
    center_id,
    centerInfo = {},
    addressInfo = {},
}) =>
    new Promise(async (resolve) => {
        const transaction = await db.sequelize.transaction();
        try {
            const centerRepo = new CenterRepository();
            const addressRepo = new AddressRepository();

            const center = await centerRepo.getCenterById(center_id);
            if (!center) {
                await transaction.rollback();
                return resolve({ err: 1, mes: "Không tìm thấy trung tâm" });
            }

            // Update address if provided
            let address_id = center.address_id;
            if (addressInfo && Object.keys(addressInfo).length > 0) {
                const normalizedAddress = {
                    street: addressInfo.street,
                    ward_code: addressInfo.ward_code ?? addressInfo.ward,
                    province_code: addressInfo.province_code,
                };

                // Server-side validation: Address model requires `province_code`
                if (!normalizedAddress.province_code) {
                    await transaction.rollback();
                    return resolve({ err: 1, mes: "province_code is required" });
                }

                if (address_id) {
                    // Update existing address
                    await addressRepo.update(address_id, normalizedAddress, transaction);
                } else {
                    // Create new address
                    const address = await addressRepo.create(
                        normalizedAddress,
                        transaction,
                    );
                    address_id = address.id;
                }
            }

            // Update center info
            await centerRepo.updateCenter(
                center_id,
                {
                    address_id,
                    ...centerInfo,
                },
                transaction,
            );

            await transaction.commit();
            resolve({ err: 0, mes: "Cập nhật trung tâm thành công" });
        } catch (error) {
            await transaction.rollback();
            resolve({ err: 1, mes: error.message });
        }
    });

export const deleteCenterAdmin = (center_id) =>
    new Promise(async (resolve) => {
        const transaction = await db.sequelize.transaction();
        try {
            const centerRepo = new CenterRepository();
            const userRepo = new UserRepository();

            const center = await centerRepo.getCenterById(center_id);
            if (!center) {
                await transaction.rollback();
                return resolve({ err: 1, mes: "Không tìm thấy trung tâm" });
            }

            // Delete center record
            await centerRepo.deleteCenter(center_id, transaction);

            // Delete user account
            await userRepo.deleteUser(center_id, transaction);

            await transaction.commit();
            resolve({ err: 0, mes: "Xóa trung tâm thành công" });
        } catch (error) {
            await transaction.rollback();
            resolve({ err: 1, mes: error.message });
        }
    });
