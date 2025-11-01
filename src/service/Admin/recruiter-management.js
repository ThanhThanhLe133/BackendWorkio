import { RecruiterManagement } from '../../builder/index.js'

export const createRecruiter = async ({
    email,
    password,
    recruiterInfo,
    addressInfo,
}) => new Promise(async (resolve, reject) => {
    try {
        const builder = new RecruiterManagement()
            .setUserInfo({ email, password })
            .setRecruiterInfo(recruiterInfo)
            .setAddressInfo(addressInfo);

        const result = await builder.create();
        resolve(result);;
    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});


export const getAllRecruitersAdmin = () => new Promise(async (resolve, reject) => {
    try {
        const admin = await db.Admin.findOne({ where: { admin_id: admin_id } });

        if (!admin) {
            return resolve({
                err: 1,
                mes: 'Admin is not exist.'
            });
        }

        const recruiters = await db.Recruiter.findAll({
            include: [
                {
                    model: db.User,
                    as: 'user',
                },
            ]
        });

        resolve({
            err: 0,
            mes: 'Get recruiters list successfully',
            data: recruiters.isEmpty ? [] : recruiters
        });

    } catch (error) {
        resolve({ err: 1, mes: error.message });
    }
});

// export const sendEmailToRecruiter = ({ admin_id, recruiter_id }) => new Promise(async (resolve, reject) => {
//     try {
//         const admin = await db.Admin.findOne({ where: { admin_id: admin_id } });

//         if (!admin) {
//             return resolve({
//                 err: 1,
//                 mes: 'Admin is not exist.'
//             });
//         }

//         const recruiter = await db.Recruiter.findOne({
//             where: { recruiter_id, is_verified: false },
//             include: [
//                 {
//                     model: db.User,
//                     as: 'user',
//                 },
//             ],
//         });
//         if (!recruiter) {
//             return resolve({
//                 err: 1,
//                 mes: "Recruiter not found or already verified.",
//             });
//         }
//         const email = recruiter.user.email;
//         const token = jwt.sign(
//             { email },
//             process.env.EMAIL_VERIFY_SECRET,
//             { expiresIn: "1d" }
//         );
//         await sendVerificationEmail(email, token, 'Recruiter');

//         resolve({
//             err: 0,
//             mes: `Recruiter verified successfully and email sent to ${email}.`,
//         });

//     } catch (error) {
//             resolve({ err: 1, mes: error.message });
//     }
// });
