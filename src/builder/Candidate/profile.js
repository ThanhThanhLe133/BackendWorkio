import { CandidateRepository } from '../../repository/index.js';

class CandidateProfileBuilder {
    constructor() {
        this.candidateRepository = new CandidateRepository();
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

        return await this.candidateRepository.updateCandidateProfile(this.id, this.payload);
    }

    async getProfile() {
        if (!this.id) throw new Error('User ID is required');
        return await this.candidateRepository.getDetailByCandidateId(this.id);
    }
}

export { CandidateProfileBuilder };
