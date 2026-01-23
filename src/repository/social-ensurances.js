import db from "../models/index.js";

class SocialInsuranceRepository {
    async getAll() {
        return db.SocialInsurance.findAll({
            include: [
                {
                    model: db.Candidate,
                    as: "candidate",
                },
            ],
        });
    }

    async getByIdentifyNumber(identify_number) {
        return db.SocialInsurance.findAll({
            where: { identify_number: identify_number },
            include: [
                {
                    model: db.Candidate,
                    as: "candidate",
                },
            ],
        });
    }
}

export { SocialInsuranceRepository };
