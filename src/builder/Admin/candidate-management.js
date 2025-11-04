import { CandidateRepository, AddressRepository, StudyHistoryRepository, WorkExperienceRepository, UserRepository } from "../../repository/index.js";
import { hashPassword } from '../../helpers/fn.js';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import db from "../../models/index.js";
dotenv.config();
import { sendVerificationEmail } from '../../helpers/email.js';

export class CandidateManagement {
    constructor() {
        this.userRepo = new UserRepository();
        this.candidateRepo = new CandidateRepository();
        this.addressRepo = new AddressRepository();
        this.studyRepo = new StudyHistoryRepository();
        this.workRepo = new WorkExperienceRepository();

        this.userData = null;
        this.addressData = null;
        this.candidateData = null;
        this.studyHistories = [];
        this.workExperiences = [];
        this.user = null;
        this.address = null;
        this.token = null;
    }

    setUserInfo({ email, password, roleValue = 'Candidate' }) {
        this.userData = { email, password, roleValue };
        return this;
    }

    setCandidateInfo(info) {
        this.candidateData = info;
        return this;
    }

    setAddressInfo(address) {
        this.addressData = address;
        return this;
    }

    setStudyHistories(histories) {
        if (Array.isArray(histories)) this.studyHistories = histories;
        return this;
    }

    setWorkExperiences(experiences) {
        if (Array.isArray(experiences)) this.workExperiences = experiences;
        return this;
    }

    async getAllCandidates() {
        const candidates = await this.candidateRepo.getAll();
        return {
            err: 0,
            mes: 'Lấy danh sách ứng viên thành công',
            data: candidates.isEmpty ? [] : candidates
        };
    }

    async createUser(transaction) {
        const existingUser = await this.userRepo.getByEmail(this.userData.email);
        if (existingUser)
            throw new Error("Email này đã được đăng ký.");

        const role = await this.userRepo.getRole(this.userData.roleValue);

        this.user = await this.userRepo.createUser({
            email: this.userData.email,
            password: hashPassword(this.userData.password),
            role_id: role.id
        }, transaction);

        this.token = jwt.sign(
            { email: this.userData.email },
            process.env.EMAIL_VERIFY_SECRET,
            { expiresIn: '1d' }
        );

        return this;
    }


    async createAddress(transaction) {
        if (!this.addressData) return this;
        this.address = await this.addressRepo.create(this.addressData, transaction);
        return this;
    }

    async createCandidate(transaction) {
        this.candidate = await this.candidateRepo.createCandidate({
            candidate_id: this.user.id,
            address_id: this.address?.id || null,
            ...this.candidateData
        }, transaction);
        return this;
    }

    async createStudyHistories(transaction) {
        for (const history of this.studyHistories) {
            await this.studyRepo.create({ candidate_id: this.user.id, ...history }, transaction);
        }
        return this;
    }

    async createWorkExperiences(transaction) {
        for (const exp of this.workExperiences) {
            await this.workRepo.create({ candidate_id: this.user.id, ...exp }, transaction);
        }
        return this;
    }

    async create() {
        const transaction = await db.sequelize.transaction();
        try {
            await this.createUser(transaction);
            await this.createAddress(transaction);
            await this.createCandidate(transaction);
            await this.createStudyHistories(transaction);
            await this.createWorkExperiences(transaction);

            await transaction.commit();

            await sendVerificationEmail(this.user.email, this.token, 'Candidate');

            return {
                err: 0,
                mes: 'Tạo ứng viên thành công. Ứng viên vuilòng kiểm tra email để xác nhận.'
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
