import express from 'express';
const routes = express.Router();
import { getActivities, createActivity, getActivityById, updateActivity, deleteActivity  } from '../controllers/activityController.js';

routes.get('/relationships/:id', getActivities);
routes.post('/relationships/:id', createActivity);
routes.get('/relationships/:id/:activityId', getActivityById);
routes.put('/relationships/:id/:activityId', updateActivity);
routes.delete('/relationships/:id/:activityId', deleteActivity);

export default routes;