import express from 'express';
const routes = express.Router();
import { getCheckins, createCheckin, getCheckinById, updateCheckin, deleteCheckin } from '../controllers/checkinController.js';

routes.get('/user/:id', getCheckins);
routes.post('/user/:id', createCheckin);
routes.get('/user/:id/:checkinId', getCheckinById);
routes.put('/user/:id/:checkinId', updateCheckin);
routes.delete('/user/:id/:checkinId', deleteCheckin);

export default routes;