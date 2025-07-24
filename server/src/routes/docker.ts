import express from 'express';
import { DockerController } from '../controllers/DockerController.js';

const router = express.Router();
const dockerController = new DockerController();

// Get all containers
router.get('/containers', dockerController.getContainers);

// Get container details
router.get('/containers/:id', dockerController.getContainer);

// Start container
router.post('/containers/:id/start', dockerController.startContainer);

// Stop container
router.post('/containers/:id/stop', dockerController.stopContainer);

// Restart container
router.post('/containers/:id/restart', dockerController.restartContainer);

// Remove container
router.delete('/containers/:id', dockerController.removeContainer);

// Get container logs
router.get('/containers/:id/logs', dockerController.getContainerLogs);

// Get Docker system info
router.get('/info', dockerController.getDockerInfo);

export default router;