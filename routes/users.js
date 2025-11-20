import express from 'express';
const routes = express.Router();
import { getUser, getCurrentUser, updateCurrentUser, createUser, updateUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import pkg from 'express-openid-connect';

const { auth, requiresAuth } = pkg;
const config = {
    authRequired:false,
    auth0Logout:true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL
};
routes.use(auth(config));

routes.get('/current', requiresAuth(), getCurrentUser);
routes.put('/current', requiresAuth(), updateCurrentUser);
routes.get('/', requiresAuth(), getAllUsers);
routes.get('/:id', getUser);
routes.post('/', requiresAuth(), createUser);
routes.put('/:id', requiresAuth(), updateUser);
routes.delete('/:id', requiresAuth(), deleteUser);

export default routes;