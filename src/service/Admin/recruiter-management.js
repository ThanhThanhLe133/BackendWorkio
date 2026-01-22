import { RecruiterManagement } from "../../builder/index.js";

export const createRecruiter = async ({
    email,
    password,
    recruiterInfo,
    addressInfo,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const builder = new RecruiterManagement()
                .setUserInfo({ email, password })
                .setRecruiterInfo(recruiterInfo)
                .setAddressInfo(addressInfo);

            const result = await builder.create();
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getAllRecruitersAdmin = (filters = {}) =>
    new Promise(async (resolve, reject) => {
        try {
            const builder = new RecruiterManagement();

            const result = await builder.getAllRecruiters(filters);
            resolve(result);
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getRecruiterDetailAdmin = (recruiter_id) =>
    new Promise(async (resolve) => {
        try {
            console.log(
                "getRecruiterDetailAdmin called with recruiter_id:",
                recruiter_id,
            );
            const repo = new (
                await import("../../repository/recruiter.js")
            ).RecruiterRepository();
            const recruiter = await repo.getDetailById(recruiter_id);
            console.log("Recruiter found:", !!recruiter);
            if (!recruiter)
                return resolve({ err: 1, mes: "Không tìm thấy nhà tuyển dụng" });
            resolve({ err: 0, mes: "Lấy chi tiết NTD thành công", data: recruiter });
        } catch (error) {
            console.log("Error in getRecruiterDetailAdmin:", error);
            resolve({ err: 1, mes: error.message });
        }
    });

export const deleteRecruiterAdmin = (recruiter_id) =>
    new Promise(async (resolve) => {
        try {
            const repo = new (
                await import("../../repository/recruiter.js")
            ).RecruiterRepository();
            const result = await repo.deleteRecruiter(recruiter_id);
            if (result) {
                resolve({ err: 0, mes: "Xóa nhà tuyển dụng thành công" });
            } else {
                resolve({ err: 1, mes: "Không tìm thấy nhà tuyển dụng" });
            }
        } catch (error) {
            console.log("Error in deleteRecruiterAdmin:", error);
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateRecruiterAdmin = (payload = {}) =>
    new Promise(async (resolve) => {
        try {
            const repo = new (
                await import("../../repository/recruiter.js")
            ).RecruiterRepository();
            const { recruiter_id, recruiterInfo, addressInfo } = payload;
            if (!recruiter_id) return resolve({ err: 1, mes: "Missing recruiter_id" });

            const result = await repo.updateRecruiterProfile(recruiter_id, {
                recruiterInfo,
                addressInfo,
            });
            if (result) {
                resolve({ err: 0, mes: "Cập nhật nhà tuyển dụng thành công" });
            } else {
                resolve({ err: 1, mes: "Không tìm thấy nhà tuyển dụng" });
            }
        } catch (error) {
            console.log("Error in updateRecruiterAdmin:", error);
            resolve({ err: 1, mes: error.message });
        }
    });
