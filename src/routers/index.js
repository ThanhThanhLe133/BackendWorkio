import authCandidate from './Candidate/auth.js'

import authRecruiter from './Recruiter/auth.js'

import authAdmin from './Admin/auth.js'
import createAdmin from './Admin/create-admin.js'
import verifyRecruiter from './Admin/verify-recruiter.js'
import { notFound } from '../middleWares/handle_error.js'

const initRoutes = (app) => {

    app.use('/candidate/auth', authCandidate)

    app.use('/recruiter/auth', authRecruiter)

    app.use('/admin/create', createAdmin)
    app.use('/admin/auth', authAdmin)
    app.use('/admin', verifyRecruiter)

    // app.use('/', notFound)
}

export default initRoutes; 