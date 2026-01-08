import authCandidate from './Candidate/auth.js'
import jobPostCandidate from './Candidate/job-post-management.js'
import interviewCandidate from './Candidate/interview.js'
import profileCandidate from './Candidate/profile.js'

import authRecruiter from './Recruiter/auth.js'
import jobPostRecruiter from './Recruiter/job-post-management.js'
import interviewRecruiter from './Recruiter/interview.js'
import profileRecruiter from './Recruiter/profile.js'

import authCenter from './Center/auth.js'
import centerCourses from './Center/course-management.js'
import profileCenter from './Center/profile.js'

import authAdmin from './Admin/auth.js'
import createAdmin from './Admin/create-admin.js'
import candidateAdmin from './Admin/candidate-management.js'
import recruiterAdmin from './Admin/recruiter-management.js'
import centerAdmin from './Admin/center-management.js'
import jobPostAdmin from './Admin/job-post-management.js'
import interviewAdmin from './Admin/interview.js'
import socialInsurances from './Admin/social-insurances.js'
import report from './Admin/report-management.js'
import profileAdmin from './Admin/profile.js'
import requestsAdmin from './Admin/requests.js'
import { notFound } from '../middleWares/handle_error.js'

import requests from './Requests/requests.js'
import me from './Me/me.js'

const initRoutes = (app) => {

    app.use('/candidate/auth', authCandidate)
    app.use('/candidate', jobPostCandidate)
    app.use('/candidate', interviewCandidate)
    app.use('/candidate/profile', profileCandidate)

    app.use('/recruiter/auth', authRecruiter)
    app.use('/recruiter', jobPostRecruiter)
    app.use('/recruiter', interviewRecruiter)
    app.use('/recruiter/profile', profileRecruiter)

    app.use('/center/auth', authCenter)
    app.use('/center', centerCourses)
    app.use('/center/profile', profileCenter)

    app.use('/admin', createAdmin)
    app.use('/admin', candidateAdmin)
    app.use('/admin', recruiterAdmin)
    app.use('/admin', centerAdmin)
    app.use('/admin-auth', authAdmin)
    app.use('/admin', jobPostAdmin)
    app.use('/admin', interviewAdmin)
    app.use('/admin', socialInsurances)
    app.use('/admin', report)
    app.use('/admin', profileAdmin)
    app.use('/admin', requestsAdmin)

    app.use('/requests', requests)
    app.use('/me', me)
    // app.use('/', notFound)
}

export default initRoutes; 
