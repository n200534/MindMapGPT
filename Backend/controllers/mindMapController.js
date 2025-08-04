const prisma = require('../config/database');
const { generateMindMap, generateResources, generateRoadmap } = require('../services/geminiService');

const createMindMap = async (req, res) => {
  try {
    const { title, prompt } = req.body;

    if (!title || !prompt) {
      return res.status(400).json({ error: 'Title and prompt are required' });
    }

    // Generate mind map using Gemini AI
    const mindMapData = await generateMindMap(prompt);
    
    // Add the original prompt to the data
    mindMapData.prompt = prompt;

    const mindMap = await prisma.mindMap.create({
      data: {
        title,
        data: mindMapData,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Mind map created successfully',
      mindMap: {
        id: mindMap.id,
        title: mindMap.title,
        data: mindMap.data,
        createdAt: mindMap.createdAt
      }
    });
  } catch (error) {
    console.error('Create mind map error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const getMindMaps = async (req, res) => {
  try {
    const mindMaps = await prisma.mindMap.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({ mindMaps });
  } catch (error) {
    console.error('Get mind maps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMindMap = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await prisma.mindMap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    res.json({ mindMap });
  } catch (error) {
    console.error('Get mind map error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMindMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, data } = req.body;

    const mindMap = await prisma.mindMap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    const updatedMindMap = await prisma.mindMap.update({
      where: { id },
      data: {
        title: title || mindMap.title,
        data: data || mindMap.data
      }
    });

    res.json({
      message: 'Mind map updated successfully',
      mindMap: updatedMindMap
    });
  } catch (error) {
    console.error('Update mind map error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMindMap = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await prisma.mindMap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    await prisma.mindMap.delete({
      where: { id }
    });

    res.json({ message: 'Mind map deleted successfully' });
  } catch (error) {
    console.error('Delete mind map error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateResourcesForMindMap = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await prisma.mindMap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    // Generate resources based on the mind map title
    const resources = await generateResources(mindMap.title);

    res.json({ resources });
  } catch (error) {
    console.error('Generate resources error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const generateRoadmapForMindMap = async (req, res) => {
  try {
    const { id } = req.params;

    const mindMap = await prisma.mindMap.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!mindMap) {
      return res.status(404).json({ error: 'Mind map not found' });
    }

    // Generate roadmap based on the mind map title
    const roadmap = await generateRoadmap(mindMap.title);

    res.json({ roadmap });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  createMindMap,
  getMindMaps,
  getMindMap,
  updateMindMap,
  deleteMindMap,
  generateResourcesForMindMap,
  generateRoadmapForMindMap
}; 