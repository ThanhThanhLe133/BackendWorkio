import { RecruiterRepository, AddressRepository, UserRepository } from "../../repository/index.js";
import { hashPassword } from '../../helpers/fn.js';
import { sendVerificationEmail } from '../../helpers/email.js';
import db from "../../models/index.js";
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

export class RecruiterManagement {
    constructor() {
        this.userRepo = new UserRepository();
        this.repo = new RecruiterRepository();
        this.addressRepo = new AddressRepository();
        this.userData = null;
        this.recruiterData = null;
        this.addressData = null;
        this.user = null;
        this.address = null;
        this.token = null;
    }

    setUserInfo({ email, password, roleValue = 'Recruiter' }) {
        this.userData = { email, password, roleValue };
        return this;
    }

    setRecruiterInfo(info) {
        this.recruiterData = info;
        return this;
    }

    setAddressInfo(address) {
        this.addressData = address;
        return this;
    }

    async getAllRecruiters(filters = {}) {
        const recruiters = await this.repo.getAll(filters);
        return {
            err: 0,
            mes: 'Lấy danh sách nhà tuyển dụng thành công',
            data: recruiters.isEmpty ? [] : recruiters
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

        this.token = jwt.sign({ email: this.userData.email }, process.env.EMAIL_VERIFY_SECRET, { expiresIn: '1d' });
        return this;
    }

    async createAddress(transaction) {
        if (!this.addressData) return this;
        const normalized = {
            street: this.addressData.street,
            province_code: this.addressData.province_code,
            ward_code: this.addressData.ward_code ?? this.addressData.ward,
        };
        this.address = await this.addressRepo.create(normalized, transaction);
        return this;
    }

    async createRecruiter(transaction) {
        await this.repo.createRecruiter({
            recruiter_id: this.user.id,
            address_id: this.address?.id || null,
            ...this.recruiterData
        }, transaction);
        return this;
    }

    async create() {
        const transaction = await db.sequelize.transaction();
        try {
            await this.createUser(transaction);
            await this.createAddress(transaction);
            await this.createRecruiter(transaction);

            await transaction.commit();
            await sendVerificationEmail(this.user.email, this.token, 'Recruiter');

            return {
                err: 0,
                mes: 'Tạo nhà tuyển dụng thành công. Nhà tuyển dụng vuilòng kiểm tra email để xác nhận.'
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
