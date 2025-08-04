const express = require('express');
const { 
  createMindMap, 
  getMindMaps, 
  getMindMap, 
  updateMindMap, 
  deleteMindMap,
  generateResourcesForMindMap,
  generateRoadmapForMindMap
} = require('../controllers/mindMapController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Mind map routes (all require authentication)
router.post('/', authenticateToken, createMindMap);
router.get('/', authenticateToken, getMindMaps);
router.get('/:id', authenticateToken, getMindMap);
router.put('/:id', authenticateToken, updateMindMap);
router.delete('/:id', authenticateToken, deleteMindMap);

// AI-powered features
router.get('/:id/resources', authenticateToken, generateResourcesForMindMap);
router.get('/:id/roadmap', authenticateToken, generateRoadmapForMindMap);

module.exports = router; 