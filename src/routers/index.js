import auth from './Candidate/auth.js'
import { notFound } from '../middleWares/handle_error.js'

const initRoutes = (app) => {

    app.use('/candidate/auth', auth)
    // app.use('/', notFound)
}

export default initRoutes; 