import { SupportRequestRepository } from "../repository/index.js";

const normalizePriority = (value) => {
    if (!value) return "medium";
    const v = String(value).toLowerCase();
    if (v === "low" || v === "medium" || v === "high") return v;
    return "medium";
};

const normalizeStatus = (value) => {
    if (!value) return "open";
    const v = String(value).toLowerCase();
    if (v === "open" || v === "in_progress" || v === "resolved") return v;
    return "open";
};

export const createSupportRequest = async ({ user_id, title, description, priority }) =>
    new Promise(async (resolve) => {
        try {
            const repo = new SupportRequestRepository();
            if (!title) throw new Error("Missing title");

            const created = await repo.create({
                title,
                description: description || null,
                priority: normalizePriority(priority),
                created_by: user_id,
            });

            resolve({ err: 0, mes: "Tạo yêu cầu hỗ trợ thành công", data: created });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getMySupportRequests = async ({ user_id }) =>
    new Promise(async (resolve) => {
        try {
            const repo = new SupportRequestRepository();
            const items = await repo.getByCreator(user_id);
            resolve({ err: 0, mes: "Lấy yêu cầu hỗ trợ thành công", data: items });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const getAllSupportRequestsAdmin = async () =>
    new Promise(async (resolve) => {
        try {
            const repo = new SupportRequestRepository();
            const items = await repo.getAll();
            resolve({ err: 0, mes: "Lấy danh sách yêu cầu hỗ trợ thành công", data: items });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const updateSupportRequestAdmin = async ({ request_id, status, priority }) =>
    new Promise(async (resolve) => {
        try {
            if (!request_id) throw new Error("Missing request_id");
            const repo = new SupportRequestRepository();

            const updated = await repo.update(request_id, {
                ...(status ? { status: normalizeStatus(status) } : {}),
                ...(priority ? { priority: normalizePriority(priority) } : {}),
            });
            if (!updated) throw new Error("Request not found");
            resolve({ err: 0, mes: "Cập nhật yêu cầu hỗ trợ thành công", data: updated });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

export const deleteSupportRequestAdmin = async ({ request_id }) =>
    new Promise(async (resolve) => {
        try {
            if (!request_id) throw new Error("Missing request_id");
            const repo = new SupportRequestRepository();
            await repo.delete(request_id);
            resolve({ err: 0, mes: "Xóa yêu cầu hỗ trợ thành công" });
        } catch (error) {
            resolve({ err: 1, mes: error.message });
        }
    });

