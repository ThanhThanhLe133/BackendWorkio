import {
    JobPostRepository,
    InterviewRepository,
    CandidateRepository,
} from "../../repository/index.js";

export class ReportJobsBuilder {
    constructor() {
        this.jobPostRepo = new JobPostRepository();
        this.interviewRepo = new InterviewRepository();
        this.candidateRepo = new CandidateRepository();
    }

    _filterByMonth(items, dateField, month, year) {
        return items.filter((item) => {
            const date = new Date(item[dateField]);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
        });
    }

    async getJobPostStats(month, year) {
        const posts = await this.jobPostRepo.getAll();
        const filtered = this._filterByMonth(posts, "created_at", month, year);
        const active = filtered.filter((post) => post.status === "Đang mở").length;
        const approved = filtered.filter(
            (post) => post.status === "Đã tuyển",
        ).length;
        const canceled = filtered.filter((post) => post.status === "Đã hủy").length;
        const total = filtered.length;

        return { total, active, approved, canceled };
    }

    async getTotalAppliedCandidates(month, year) {
        const posts = await this.jobPostRepo.getAll();
        const filtered = this._filterByMonth(posts, "created_at", month, year);

        let totalApplied = 0;
        for (const post of filtered) {
            if (Array.isArray(post.applied_candidates)) {
                totalApplied += post.applied_candidates.length;
            }
        }

        return totalApplied;
    }
    async getTotalInterviewedCandidates(month, year) {
        const interviews = await this.interviewRepo.getAllInterviews();

        const filtered = this._filterByMonth(
            interviews,
            "scheduled_time",
            month,
            year,
        );

        const uniqueCandidateIds = new Set(filtered.map((i) => i.candidate_id));

        return uniqueCandidateIds.size;
    }

    async getTotalInterviews(month, year) {
        const interviews = await this.interviewRepo.getAllInterviews();
        const filtered = this._filterByMonth(
            interviews,
            "scheduled_time",
            month,
            year,
        );
        const total = filtered.length;

        const ongoing = filtered.filter((i) => i.status === "Đang diễn ra").length;
        const ended = filtered.filter((i) => i.status === "Đã kết thúc").length;
        return { total, ongoing, ended };
    }

    async getInterviewPassRate(month, year) {
        const interviews = await this.interviewRepo.getAllInterviews();
        const jobPosts = await this.jobPostRepo.getAll();
        const candidates = await this.candidateRepo.getAll();

        const filtered = this._filterByMonth(
            interviews,
            "scheduled_time",
            month,
            year,
        ).filter((i) => i.status === "Đã kết thúc");

        const filteredWithApprovedJob = filtered.filter((i) => {
            const job = jobPosts.find((j) => j.id === i.job_post_id);
            return job && job.status === "Đã tuyển";
        });

        const total = filteredWithApprovedJob.length;

        const passed = filteredWithApprovedJob.filter((i) => {
            const candidate = candidates.find(
                (c) => c.candidate_id === i.candidate_id,
            );
            return candidate?.is_employed;
        }).length;

        const failed = filteredWithApprovedJob.filter((i) => {
            const candidate = candidates.find(
                (c) => c.candidate_id === i.candidate_id,
            );
            return !candidate?.is_employed;
        }).length;

        return { total, passed, failed };
    }

    async getEmployedCandidates() {
        const candidates = await this.candidateRepo.getAll();
        const employed = candidates.filter((c) => c.is_employed).length;
        const total = candidates.length;
        return { total, employed };
    }

    async getMonthlyReport(month, year) {
        const [
            jobPostStats,
            totalAppliedCandidates,
            totalInterviewedCandidates,
            totalInterviews,
            interviewPassRate,
            employedCandidates,
        ] = await Promise.all([
            this.getJobPostStats(month, year),
            this.getTotalAppliedCandidates(month, year),
            this.getTotalInterviewedCandidates(month, year),
            this.getTotalInterviews(month, year),
            this.getInterviewPassRate(month, year),
            this.getEmployedCandidates(),
        ]);

        // If no data for the requested month, show overall statistics
        if (
            jobPostStats.total === 0 &&
            totalAppliedCandidates === 0 &&
            totalInterviewedCandidates === 0
        ) {
            console.log(`No data for ${month}/${year}, showing overall statistics`);

            // Get all job posts regardless of date
            const allPosts = await this.jobPostRepo.getAll();
            const allInterviews = await this.interviewRepo.getAllInterviews();

            const overallJobPostStats = {
                total: allPosts.length,
                active: allPosts.filter((post) => post.status === "Đang mở").length,
                approved: allPosts.filter((post) => post.status === "Đã tuyển").length,
                canceled: allPosts.filter((post) => post.status === "Đã hủy").length,
            };

            const overallAppliedCandidates = allPosts.reduce((total, post) => {
                return (
                    total +
                    (Array.isArray(post.applied_candidates)
                        ? post.applied_candidates.length
                        : 0)
                );
            }, 0);

            const overallInterviewedCandidates = new Set(
                allInterviews.map((i) => i.candidate_id),
            ).size;

            const overallInterviews = {
                total: allInterviews.length,
                ongoing: allInterviews.filter((i) => i.status === "Đang diễn ra")
                    .length,
                ended: allInterviews.filter((i) => i.status === "Đã kết thúc").length,
            };

            return {
                jobPostStats: overallJobPostStats,
                totalAppliedCandidates: overallAppliedCandidates,
                totalInterviewedCandidates: overallInterviewedCandidates,
                totalInterviews: overallInterviews,
                interviewPassRate, // Keep the month-filtered interview pass rate
                employedCandidates,
            };
        }

        return {
            jobPostStats,
            totalAppliedCandidates,
            totalInterviewedCandidates,
            totalInterviews,
            interviewPassRate,
            employedCandidates,
        };
    }
}
