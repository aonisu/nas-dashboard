import express from 'express';
import { LinksController } from '../controllers/LinksController.js';

const router = express.Router();
const linksController = new LinksController();

// Get all system links
router.get('/', linksController.getAllLinks);

// Get link by ID
router.get('/:id', linksController.getLinkById);

// Create new link
router.post('/', linksController.createLink);

// Update link
router.put('/:id', linksController.updateLink);

// Delete link
router.delete('/:id', linksController.deleteLink);

// Check link status
router.get('/:id/status', linksController.checkLinkStatus);

// Bulk status check
router.post('/status/check', linksController.bulkStatusCheck);

export default router;