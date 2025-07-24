import express from 'express';
import { SystemController } from '../controllers/SystemController.js';

const router = express.Router();
const systemController = new SystemController();

// Get system information
router.get('/info', systemController.getSystemInfo);

// Get system performance data
router.get('/performance', systemController.getPerformanceData);

// Get system statistics history
router.get('/stats/history', systemController.getStatsHistory);

export default router;