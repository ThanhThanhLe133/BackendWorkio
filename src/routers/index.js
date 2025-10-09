import auth from './auth.js'
import { notFound } from '../middleWares/handle_error.js'

const initRoutes = (app) => {

    app.use('/api/v1/auth', auth)
    app.use('/', notFound)
}

export default initRoutes; 