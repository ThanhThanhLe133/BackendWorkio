import { SocialInsuranceRepository } from "../../repository/index.js";

export class SocialInsurancesBuilder {
    constructor() {
        this.socialInsuranceRepo = new SocialInsuranceRepository();
        this.socialInsurance = {};
    }

    build() {
        return this.socialInsurance;
    }
    async getAll(filter = {}) {
        const list = await this.socialInsuranceRepo.getAll(filter);
        return {
            err: 0,
            mes: "Lấy danh sách BHXH thành công",
            data: list
        };
    }

    async getByIdentifyNumber(identify_number) {
        const list = await this.socialInsuranceRepo.getByIdentifyNumber(identify_number);
        if (!list || list.length === 0) {
            return {
                err: 1,
                mes: `Không tìm thấy BHXH cho ứng viên ${identify_number}`,
                data: []
            };
        }
        return {
            err: 0,
            mes: `Lấy danh sách BHXH của ứng viên ${identify_number} thành công`,
            data: list
        };
    }
}
