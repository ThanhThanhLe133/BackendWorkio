import db from "./src/models/index.js";
import bcrypt from "bcryptjs";

const seedDatabase = async () => {
    try {
        console.log("🌱 Starting database seeding...");

        // Get role IDs
        const adminRole = await db.Role.findOne({ where: { value: "Admin" } });
        const recruiterRole = await db.Role.findOne({
            where: { value: "Recruiter" },
        });
        const candidateRole = await db.Role.findOne({
            where: { value: "Candidate" },
        });

        if (!adminRole || !recruiterRole || !candidateRole) {
            throw new Error("Required roles not found. Please run migrations first.");
        }

        // Create sample users
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Create admin user
        const adminUser = await db.User.create({
            email: "admin@workio.com",
            password: hashedPassword,
            role_id: adminRole.id,
            is_verified: true,
        });

        await db.Admin.create({
            admin_id: adminUser.id,
        });

        // Create recruiter user
        const recruiterUser = await db.User.create({
            email: "recruiter@workio.com",
            password: hashedPassword,
            role_id: recruiterRole.id,
            is_verified: true,
        });

        const recruiter = await db.Recruiter.create({
            recruiter_id: recruiterUser.id,
            company_name: "Tech Corp",
            contact_person: "John Doe",
            phone: "0123456789",
            address: "123 Tech Street",
        });

        // Create candidate users
        const candidateUser1 = await db.User.create({
            email: "candidate1@workio.com",
            password: hashedPassword,
            role_id: candidateRole.id,
            is_verified: true,
        });

        const candidate1 = await db.Candidate.create({
            candidate_id: candidateUser1.id,
            full_name: "Alice Johnson",
            phone: "0987654321",
            is_employed: false,
        });

        const candidateUser2 = await db.User.create({
            email: "candidate2@workio.com",
            password: hashedPassword,
            role_id: candidateRole.id,
            is_verified: true,
        });

        const candidate2 = await db.Candidate.create({
            candidate_id: candidateUser2.id,
            full_name: "Bob Smith",
            phone: "0987654322",
            is_employed: true,
        });

        // Create job posts for current month (January 2026)
        const jobPost1 = await db.JobPost.create({
            position: "Frontend Developer",
            title: "Frontend Developer",
            description: "Develop web applications",
            requirements: "React, JavaScript",
            salary_min: 1000,
            salary_max: 2000,
            job_type: "Full-time",
            working_time: "Full-time",
            location: "Ho Chi Minh City",
            status: "Đang mở",
            recruiter_id: recruiter.recruiter_id,
            applied_candidates: [candidate1.candidate_id],
            created_at: new Date("2026-01-15T10:00:00Z"),
        });

        const jobPost2 = await db.JobPost.create({
            position: "Backend Developer",
            title: "Backend Developer",
            description: "Develop server applications",
            requirements: "Node.js, PostgreSQL",
            salary_min: 1200,
            salary_max: 2500,
            job_type: "Full-time",
            working_time: "Full-time",
            location: "Ha Noi",
            status: "Đã tuyển",
            recruiter_id: recruiter.recruiter_id,
            applied_candidates: [candidate1.candidate_id, candidate2.candidate_id],
            created_at: new Date("2026-01-10T10:00:00Z"),
        });

        const jobPost3 = await db.JobPost.create({
            position: "UI/UX Designer",
            title: "UI/UX Designer",
            description: "Design user interfaces",
            requirements: "Figma, Adobe XD",
            salary_min: 800,
            salary_max: 1500,
            job_type: "Part-time",
            working_time: "Part-time",
            location: "Da Nang",
            status: "Đã hủy",
            recruiter_id: recruiter.recruiter_id,
            applied_candidates: [],
            created_at: new Date("2026-01-05T10:00:00Z"),
        });

        // Create interviews for current month
        const interview1 = await db.Interview.create({
            candidate_id: candidate1.candidate_id,
            job_post_id: jobPost1.id,
            scheduled_time: new Date("2026-01-20T14:00:00Z"),
            location: "Online",
            status: "Đang diễn ra",
            notes: "Technical interview",
        });

        const interview2 = await db.Interview.create({
            candidate_id: candidate2.candidate_id,
            job_post_id: jobPost2.id,
            scheduled_time: new Date("2026-01-18T10:00:00Z"),
            location: "Office",
            status: "Đã kết thúc",
            notes: "Final interview - passed",
        });

        const interview3 = await db.Interview.create({
            candidate_id: candidate1.candidate_id,
            job_post_id: jobPost2.id,
            scheduled_time: new Date("2026-01-12T09:00:00Z"),
            location: "Office",
            status: "Đã kết thúc",
            notes: "Technical interview - failed",
        });

        console.log("✅ Database seeded successfully!");
        console.log("📊 Sample data created for January 2026");
        console.log("👤 Admin: admin@workio.com / password123");
        console.log("🏢 Recruiter: recruiter@workio.com / password123");
        console.log(
            "👨‍💼 Candidates: candidate1@workio.com, candidate2@workio.com / password123",
        );
    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        process.exit(0);
    }
};

seedDatabase();
