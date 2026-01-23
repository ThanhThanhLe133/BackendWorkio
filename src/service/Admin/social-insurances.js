import { SocialInsurancesBuilder } from '../../builder/index.js';

export const getSocialInsurances = async ({ identify_number }) => new Promise(async (resolve) => {
    try {
        const builder = new SocialInsurancesBuilder()

        const result = await builder.getByIdentifyNumber(identify_number);
        resolve(result);
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

export const countUnemploymentBenefits = async ({ identify_number }) => new Promise(async (resolve) => {
    try {
        const builder = new SocialInsurancesBuilder();
        const socialInsurances = await builder.getByIdentifyNumber(identify_number);

        if (socialInsurances.err) return socialInsurances;

        // Nếu không có dữ liệu BHXH
        if (!socialInsurances.data || socialInsurances.data.length === 0) {
            return resolve({
                err: 0,
                mes: "Không có dữ liệu BHXH để tính trợ cấp thất nghiệp",
                data: {
                    totalMonths: 0,
                    totalBenefits: 0
                }
            });
        }

        let totalBenefits = 0;
        let totalMonths = 0;

        socialInsurances.data.forEach(item => {
            const salary = parseFloat(item.salary_base || 0);

            const start = item.start_date ? new Date(item.start_date) : null;
            const end = item.end_date ? new Date(item.end_date) : new Date(); // nếu end_date null => tính đến hiện tại

            if (start) {
                const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
                totalMonths += months;
                totalBenefits += months * salary * 0.6;
            }
        });

        resolve({
            err: 0,
            mes: `Ứng viên đã tham gia BHXH ${totalMonths} tháng, tổng trợ cấp thất nghiệp ước tính`,
            data: {
                totalMonths,
                totalBenefits
            }
        });
    } catch (error) {
        console.error('Count Unemployment Benefits error:', error);
        resolve({ err: 1, mes: error.message });
    }
});
