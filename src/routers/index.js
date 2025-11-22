import authCandidate from './Candidate/auth.js'
import jobPostCandidate from './Candidate/job-post-management.js'
import interviewCandidate from './Candidate/interview.js'
import profileCandidate from './Candidate/profile.js'

import authRecruiter from './Recruiter/auth.js'
import jobPostRecruiter from './Recruiter/job-post-management.js'
import interviewRecruiter from './Recruiter/interview.js'
import profileRecruiter from './Recruiter/profile.js'

import authAdmin from './Admin/auth.js'
import createAdmin from './Admin/create-admin.js'
import candidateAdmin from './Admin/candidate-management.js'
import recruiterAdmin from './Admin/recruiter-management.js'
import jobPostAdmin from './Admin/job-post-management.js'
import interviewAdmin from './Admin/interview.js'
import socialInsurances from './Admin/social-insurances.js'
import report from './Admin/report-management.js'
import educationCenterAdmin from './Admin/education-center-management.js'
import trainingCourseAdmin from './Admin/training-course-management.js'
import courseEnrollmentAdmin from './Admin/course-enrollment-management.js'
import { notFound } from '../middleWares/handle_error.js'

const initRoutes = (app) => {

    app.use('/candidate/auth', authCandidate)
    app.use('/candidate', jobPostCandidate)
    app.use('/candidate', interviewCandidate)
    app.use('/candidate/profile', profileCandidate)

    app.use('/recruiter/auth', authRecruiter)
    app.use('/recruiter', jobPostRecruiter)
    app.use('/recruiter', interviewRecruiter)
    app.use('/recruiter/profile', profileRecruiter)

    app.use('/admin', createAdmin)
    app.use('/admin', candidateAdmin)
    app.use('/admin', recruiterAdmin)
    app.use('/admin-auth', authAdmin)
    app.use('/admin', jobPostAdmin)
    app.use('/admin', interviewAdmin)
    app.use('/admin', socialInsurances)
    app.use('/admin', report)
    app.use('/admin/education-centers', educationCenterAdmin)
    app.use('/admin/training-courses', trainingCourseAdmin)
    app.use('/admin/course-enrollments', courseEnrollmentAdmin)
    // app.use('/', notFound)
}

export default initRoutes; 