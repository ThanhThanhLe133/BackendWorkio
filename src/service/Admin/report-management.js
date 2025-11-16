import { ReportJobsBuilder } from '../../builder/index.js';
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import supabase from "../../config/supabaseClient.js";

export const getReportByMonth = async ({ month, year }) => new Promise(async (resolve) => {
    try {
        const builder = new ReportJobsBuilder();
        const report = await builder.getMonthlyReport(month, year);

        resolve({
            err: 0,
            mes: `Báo cáo tổng hợp tháng ${month}/${year}`,
            data: report
        });
    } catch (error) {
        console.error('getReportByMonth error:', error);
        resolve({ err: 1, mes: error.message });
    }
});

const TEMPLATE_BUCKET = "documents";
const TEMPLATE_FILE = "Report.doc";
export const generateMonthlyReport = async ({ month, year, outputPath }) => new Promise(async (resolve) => {
    try {
        const report = await this.reportBuilder.getMonthlyReport(month, year);

        // 2. Tải template từ Supabase Storage
        const { data: fileData, error } = await supabase.storage
            .from(TEMPLATE_BUCKET)
            .download(TEMPLATE_FILE);

        if (error) throw new Error("Không tải được template từ Supabase Storage");

        const arrayBuffer = await fileData.arrayBuffer();
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

        // 3. Tính tỉ lệ
        const totalJobPosts = report.jobPostStats.total || 1;
        const totalInterviewedCandidates = report.totalInterviewedCandidates || 1;
        const totalInterviews = report.totalInterviews.ongoing + report.totalInterviews.ended || 1;

        const activePostsRate = ((report.jobPostStats.active / totalJobPosts) * 100).toFixed(2) + "%";
        const approvedPostsRate = ((report.jobPostStats.approved / totalJobPosts) * 100).toFixed(2) + "%";
        const canceledPostsRate = ((report.jobPostStats.canceled / totalJobPosts) * 100).toFixed(2) + "%";
        const appliedCandidatesRate = ((report.totalAppliedCandidates / totalJobPosts) * 100).toFixed(2) + "%";
        const interviewedCandidatesRate = ((report.totalInterviewedCandidates / totalJobPosts) * 100).toFixed(2) + "%";
        const ongoingInterviewsRate = ((report.totalInterviews.ongoing / totalInterviews) * 100).toFixed(2) + "%";
        const endedInterviewsRate = ((report.totalInterviews.ended / totalInterviews) * 100).toFixed(2) + "%";
        const passedInterviewsRate = ((report.interviewPassRate.passed / totalInterviewedCandidates) * 100).toFixed(2) + "%";
        const failedInterviewsRate = ((report.interviewPassRate.failed / totalInterviewedCandidates) * 100).toFixed(2) + "%";
        const employedCandidatesRate = ((report.employedCandidates.employed / totalJobPosts) * 100).toFixed(2) + "%";

        // 4. Điền dữ liệu vào template
        doc.setData({
            month,
            year,
            // I. Tin tuyển dụng
            activePosts: report.jobPostStats.active,
            activePostsRate,
            approvedPosts: report.jobPostStats.approved,
            approvedPostsRate,
            canceledPosts: report.jobPostStats.canceled,
            canceledPostsRate,
            totalJobPosts,
            // II. Người lao động
            totalAppliedCandidates: report.totalAppliedCandidates,
            appliedCandidatesRate,
            totalInterviewedCandidates: report.totalInterviewedCandidates,
            interviewedCandidatesRate,
            // III. Nhà tuyển dụng
            ongoingInterviews: report.totalInterviews.ongoing,
            ongoingInterviewsRate,
            endedInterviews: report.totalInterviews.ended,
            endedInterviewsRate,
            totalInterviews,
            // IV. Hiệu quả tuyển dụng
            passedInterviews: report.interviewPassRate.passed,
            passedInterviewsRate,
            failedInterviews: report.interviewPassRate.failed,
            failedInterviewsRate,
            employedCandidates: report.employedCandidates.employed,
            employedCandidatesRate
        });

        doc.render();
        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        fs.writeFileSync(outputPath, buffer);

        console.log(`Báo cáo đã tạo thành công: ${outputPath}`);
        resolve({ outputPath });
    } catch (err) {
        console.error("Lỗi khi tạo báo cáo:", err.message);
        throw err;
    }
});
