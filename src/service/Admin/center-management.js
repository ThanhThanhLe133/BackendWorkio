import { CenterRepository, CourseRepository } from '../../repository/index.js';
import { UserRepository, AddressRepository } from '../../repository/index.js';
import { hashPassword } from '../../helpers/fn.js';
import db from '../../models/index.js';

export const getCenterDetailAdmin = (center_id) => new Promise(async (resolve) => {
    try {
        const repo = new CenterRepository();
        const center = await repo.getCenterById(center_id);
        if (!center) return resolve({ err: 1, mes: 'Không tìm thấy trung tâm' });
        resolve({ err: 0, mes: 'Lấy chi tiết trung tâm thành công', data: center });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const getAllCentersAdmin = () => new Promise(async (resolve) => {
    try {
        const repo = new CenterRepository();
        const centers = await repo.getAll();
        resolve({ err: 0, mes: 'Lấy danh sách trung tâm thành công', data: centers || [] });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const createCenterAdmin = ({
    email,
    password,
    centerInfo = {},
    addressInfo = {},
}) => new Promise(async (resolve) => {
    const transaction = await db.sequelize.transaction();
    try {
        const userRepo = new UserRepository();
        const centerRepo = new CenterRepository();
        const addressRepo = new AddressRepository();

        const existingUser = await userRepo.getByEmail(email);
        if (existingUser) {
            await transaction.rollback();
            return resolve({ err: 1, mes: 'Email này đã được đăng ký' });
        }

        const role = await userRepo.getRole('Center');
        const user = await userRepo.createUser({
            email,
            password: hashPassword(password),
            role_id: role.id
        }, transaction);

        let address_id = null;
        if (addressInfo && Object.keys(addressInfo).length > 0) {
            const normalizedAddress = {
                street: addressInfo.street,
                ward_code: addressInfo.ward_code ?? addressInfo.ward,
                province_code: addressInfo.province_code,
            };
            const address = await addressRepo.create(normalizedAddress, transaction);
            address_id = address.id;
        }

        await centerRepo.createCenter({
            center_id: user.id,
            address_id,
            email,
            ...centerInfo,
        }, transaction);

        await transaction.commit();
        resolve({ err: 0, mes: 'Tạo trung tâm thành công' });
    } catch (error) {
        await transaction.rollback();
        resolve({ err: 1, mes: error.message });
    }
});

export const getCenterCoursesAdmin = (center_id) => new Promise(async (resolve) => {
    try {
        if (!center_id) return resolve({ err: 1, mes: 'Missing center_id' });
        const courseRepo = new CourseRepository();
        const courses = await courseRepo.getByCenterId(center_id);
        resolve({ err: 0, mes: 'Lấy khóa học của trung tâm thành công', data: courses || [] });
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});
