import express from 'express';
import { calculateShipping, getLocations } from '../controllers/addressController.js';

const router = express.Router();

router.post('/calculate', calculateShipping);
router.get('/locations', getLocations);

export default router;
