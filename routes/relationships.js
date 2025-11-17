import express from 'express';
const routes = express.Router();
import { getRelationships, addRelationship, removeRelationship } from '../controllers/relationshipController.js';

routes.get('/:userId', getRelationships);
routes.post('/', addRelationship);
routes.delete('/:userId/:relationshipId', removeRelationship);

export default routes;

