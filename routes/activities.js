import express from 'express';
const routes = express.Router();
import { getActivities, createActivity, getActivityById, updateActivity, deleteActivity  } from '../controllers/activityController.js';

routes.get('/relationship/:id', getActivities);
routes.post('/relationship/:id', createActivity);
routes.get('/relationship/:id/:activityId', getActivityById);
routes.put('/relationship/:id/:activityId', updateActivity);
routes.delete('/relationship/:id/:activityId', deleteActivity);

export default routes;