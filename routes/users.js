import express from 'express';
const routes = express.Router();
import { getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';

routes.get('/:id', getUser);
routes.post('/', createUser);
routes.put('/:id', updateUser);
routes.delete('/:id', deleteUser);

export default routes;