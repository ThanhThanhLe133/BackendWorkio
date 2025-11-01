import authCandidate from './Candidate/auth.js'

import authRecruiter from './Recruiter/auth.js'

import authAdmin from './Admin/auth.js'
import createAdmin from './Admin/create-admin.js'
import candidateAdmin from './Admin/candidate-management.js'
import recruiterAdmin from './Admin/recruiter-management.js'
import { notFound } from '../middleWares/handle_error.js'

const initRoutes = (app) => {

    app.use('/candidate/auth', authCandidate)

    app.use('/recruiter/auth', authRecruiter)

    app.use('/admin', createAdmin)
    app.use('/admin', candidateAdmin)
    app.use('/admin', recruiterAdmin)
    app.use('/admin/auth', authAdmin)

    // app.use('/', notFound)
}

export default initRoutes; 