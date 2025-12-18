import { CenterRepository, AddressRepository, UserRepository } from "../../repository/index.js";
import { hashPassword } from '../../helpers/fn.js';
import { sendVerificationEmail } from '../../helpers/email.js';
import db from "../../models/index.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export class CenterManagement {
    constructor() {
        this.userRepo = new UserRepository();
        this.centerRepo = new CenterRepository();
        this.addressRepo = new AddressRepository();

        this.userData = null;
        this.centerData = null;
        this.addressData = null;
        this.user = null;
        this.address = null;
        this.token = null;
    }

    setUserInfo({ email, password, roleValue = 'Center' }) {
        this.userData = { email, password, roleValue };
        return this;
    }

    setCenterInfo(info) {
        this.centerData = info;
        return this;
    }

    setAddressInfo(address) {
        this.addressData = address;
        return this;
    }

    async getAllCenters() {
        const centers = await this.centerRepo.getAll();
        return {
            err: 0,
            mes: 'Lấy danh sách trung tâm thành công',
            data: centers?.length ? centers : []
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

    async createCenter(transaction) {
        if (!this.centerData?.name) throw new Error('Tên trung tâm là bắt buộc');
        await this.centerRepo.createCenter({
            center_id: this.user.id,
            address_id: this.address?.id || null,
            email: this.user.email,
            ...this.centerData
        }, transaction);
        return this;
    }

    async create() {
        const transaction = await db.sequelize.transaction();
        try {
            await this.createUser(transaction);
            await this.createAddress(transaction);
            await this.createCenter(transaction);

            await transaction.commit();
            await sendVerificationEmail(this.user.email, this.token, 'Center');

            return {
                err: 0,
                mes: 'Tạo trung tâm thành công. Trung tâm vui lòng kiểm tra email để xác nhận.'
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
