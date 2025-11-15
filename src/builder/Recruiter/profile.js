import { RecruiterRepository } from '../../repository/index.js';

class RecruiterProfileBuilder {
    constructor() {
        this.recruiterRepository = new RecruiterRepository();
        this.id = null;
        this.payload = null;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    setPayload(payload) {
        this.payload = payload;
        return this;
    }

    async updateProfile() {
        if (!this.id || !this.payload) {
            throw new Error('User ID and payload are required');
        }

        return await this.recruiterRepository.updateRecruiterProfile(this.id, this.payload);
    }
}

export { RecruiterProfileBuilder };
