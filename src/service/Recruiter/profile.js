import db from '../../models/index.js';

const filterFields = (payload) => {
    const userFields = {};
    if (payload.name) userFields.name = payload.name;
    if (payload.avatar_url) userFields.avatar_url = payload.avatar_url;

    const recruiterFields = {};
    if (payload.company_name) recruiterFields.company_name = payload.company_name;
    if (payload.description) recruiterFields.description = payload.description;
    if (payload.phone) recruiterFields.phone = payload.phone;
    if (payload.website) recruiterFields.website = payload.website;
    if (payload.established_at) recruiterFields.established_at = payload.established_at;

    const addressFields = {};
    if (payload.province_code) addressFields.province_code = payload.province_code;
    if (payload.ward_code) addressFields.ward_code = payload.ward_code;
    if (payload.street) addressFields.street = payload.street;

    return { userFields, recruiterFields, addressFields };
};

export const editRecruiterProfile = ({ userId, payload }) =>
    new Promise(async (resolve, reject) => {
        const { userFields, recruiterFields, addressFields } = filterFields(payload);

        try {
            const result = await db.sequelize.transaction(async (t) => {

                const recruiter = await db.Recruiter.findOne({
                    where: { recruiter_id: userId },
                    transaction: t
                });

                if (!recruiter) {
                    throw new Error('Recruiter profile not found');
                }

                // Cập nhật bảng Users 
                if (Object.keys(userFields).length > 0) {
                    await db.User.update(userFields, {
                        where: { id: userId },
                        transaction: t
                    });
                }

                // Cập nhật bảng Recruiters 
                if (Object.keys(recruiterFields).length > 0) {
                    await recruiter.update(recruiterFields, { transaction: t });
                }

                // Cập nhật bảng Addresses
                if (Object.keys(addressFields).length > 0 && recruiter.address_id) {
                    await db.Address.update(addressFields, {
                        where: { id: recruiter.address_id },
                        transaction: t
                    });
                }

                return { err: 0, mes: 'Profile updated successfully.' };
            });

            resolve(result);

        } catch (error) {
            console.error('Service Error:', error);
            reject({ err: 2, mes: error.message || 'Error updating profile' });
        }
    });