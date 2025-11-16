import * as services from '../../service/index.js'
import { internalServerError, badRequest } from '../../middleWares/handle_error.js'
import path from "path";
import fs from "fs";
import { getAdminId } from '../../helpers/check_user.js'

export const getReportByMonth = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;
        const month = parseInt(req.query.month, 10);
        const year = parseInt(req.query.year, 10);

        if (!month || !year) {
            return res.status(400).json({ err: 1, mes: "Thiếu month hoặc year" });
        }

        const response = await services.getReportByMonth({ month, year });

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return internalServerError(res);
    }
};

export const generateMonthReport = async (req, res) => {
    try {
        const admin_id = getAdminId(req, res);
        if (!admin_id) return;

        const month = parseInt(req.query.month, 10);
        const year = parseInt(req.query.year, 10);

        if (!month || !year) {
            return res.status(400).json({ err: 1, mes: "Thiếu month hoặc year" });
        }
        console.log(123);

        const outputPath = path.join("./downloads", `MonthlyReport_${year}_${month}.docx`);
        await services.generateMonthReport({ month, year, outputPath });

        // Gửi file download trực tiếp
        res.download(outputPath, `MonthlyReport_${year}_${month}.docx`, err => {
            if (err) {
                console.error("Tải file thất bại:", err);
                res.status(500).send("Tải file thất bại");
            } else {
                // Xóa file tạm sau khi gửi xong
                fs.unlink(outputPath, unlinkErr => {
                    if (unlinkErr) console.error("Xóa file tạm thất bại:", unlinkErr);
                });
            }
        });
    } catch (error) {
        console.error(error);
        return internalServerError(res);
    }
};