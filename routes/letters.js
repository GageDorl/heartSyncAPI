import express from 'express';
const routes = express.Router();
import { getLetters, createLetter, getLetterById, updateLetter, deleteLetter } from '../controllers/letterController.js';

routes.get('/relationships/:id', getLetters);
routes.post('/relationships/:id', createLetter);
routes.get('/relationships/:id/:letterId', getLetterById);
routes.put('/relationships/:id/:letterId', updateLetter);
routes.delete('/relationships/:id/:letterId', deleteLetter);

export default routes;