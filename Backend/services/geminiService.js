const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback mind map structure
const createFallbackMindMap = (prompt) => {
  return {
    root: {
      id: 'root',
      text: prompt,
      children: [
        {
          id: '1',
          text: 'Main Concept 1',
          children: [
            { id: '1-1', text: 'Sub-concept 1.1' },
            { id: '1-2', text: 'Sub-concept 1.2' }
          ]
        },
        {
          id: '2',
          text: 'Main Concept 2',
          children: [
            { id: '2-1', text: 'Sub-concept 2.1' },
            { id: '2-2', text: 'Sub-concept 2.2' }
          ]
        },
        {
          id: '3',
          text: 'Main Concept 3',
          children: [
            { id: '3-1', text: 'Sub-concept 3.1' },
            { id: '3-2', text: 'Sub-concept 3.2' }
          ]
        }
      ]
    }
  };
};

// Fallback resources
const createFallbackResources = (topic) => {
  return {
    resources: [
      {
        type: 'video',
        title: `Introduction to ${topic}`,
        description: `Learn the basics of ${topic} with this comprehensive video tutorial`,
        url: 'https://www.youtube.com/watch?v=example',
        platform: 'YouTube'
      },
      {
        type: 'article',
        title: `${topic} Fundamentals`,
        description: `A detailed guide covering the core concepts of ${topic}`,
        url: 'https://medium.com/example',
        platform: 'Medium'
      },
      {
        type: 'documentation',
        title: `${topic} Official Documentation`,
        description: `Official documentation and guides for ${topic}`,
        url: 'https://docs.example.com',
        platform: 'Official Docs'
      }
    ]
  };
};

// Fallback roadmap
const createFallbackRoadmap = (topic) => {
  return {
    roadmap: {
      title: `Learning Roadmap for ${topic}`,
      phases: [
        {
          id: 'phase-1',
          title: 'Foundation',
          description: 'Learn the basic concepts and fundamentals',
          duration: '2-3 weeks',
          tasks: [
            {
              id: 'task-1',
              title: 'Understand basic concepts',
              description: 'Learn the core principles and terminology',
              status: 'pending'
            },
            {
              id: 'task-2',
              title: 'Set up development environment',
              description: 'Install necessary tools and software',
              status: 'pending'
            }
          ]
        },
        {
          id: 'phase-2',
          title: 'Intermediate',
          description: 'Build practical skills and work on projects',
          duration: '4-6 weeks',
          tasks: [
            {
              id: 'task-3',
              title: 'Work on small projects',
              description: 'Apply your knowledge to real-world scenarios',
              status: 'pending'
            },
            {
              id: 'task-4',
              title: 'Learn advanced concepts',
              description: 'Dive deeper into complex topics',
              status: 'pending'
            }
          ]
        }
      ]
    }
  };
};

const generateMindMap = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mindMapPrompt = `
    Create a structured mind map for the following topic: "${prompt}"
    
    Please generate a JSON structure with the following format:
    {
      "root": {
        "id": "root",
        "text": "Main Topic",
        "children": [
          {
            "id": "1",
            "text": "Main Concept 1",
            "children": [
              { "id": "1-1", "text": "Sub-concept 1.1" },
              { "id": "1-2", "text": "Sub-concept 1.2" }
            ]
          },
          {
            "id": "2", 
            "text": "Main Concept 2",
            "children": [
              { "id": "2-1", "text": "Sub-concept 2.1" },
              { "id": "2-2", "text": "Sub-concept 2.2" }
            ]
          }
        ]
      }
    }
    
    Make sure to:
    1. Create 3-5 main concepts that are relevant to the topic
    2. Each main concept should have 2-4 sub-concepts
    3. Use clear, concise text for each node
    4. Ensure the structure is logical and educational
    5. Return only valid JSON without any additional text
    `;

    const result = await model.generateContent(mindMapPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    console.log('Using fallback mind map structure');
    return createFallbackMindMap(prompt);
  }
};

const generateResources = async (topic) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const resourcesPrompt = `
    For the topic "${topic}", provide a curated list of learning resources in the following JSON format:
    
    {
      "resources": [
        {
          "type": "video",
          "title": "Resource Title",
          "description": "Brief description",
          "url": "https://example.com",
          "platform": "YouTube/Coursera/etc"
        },
        {
          "type": "article",
          "title": "Article Title", 
          "description": "Brief description",
          "url": "https://example.com",
          "platform": "Medium/GitHub/etc"
        },
        {
          "type": "documentation",
          "title": "Documentation Title",
          "description": "Brief description", 
          "url": "https://example.com",
          "platform": "Official Docs/etc"
        }
      ]
    }
    
    Please provide:
    - 2-3 high-quality video resources (YouTube, Coursera, etc.)
    - 2-3 informative articles or blog posts
    - 1-2 official documentation or guides
    - Make sure all resources are relevant and up-to-date
    - Return only valid JSON without additional text
    `;

    const result = await model.generateContent(resourcesPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    console.log('Using fallback resources');
    return createFallbackResources(topic);
  }
};

const generateRoadmap = async (topic) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const roadmapPrompt = `
    Create a learning roadmap for "${topic}" in the following JSON format:
    
    {
      "roadmap": {
        "title": "Learning Roadmap for ${topic}",
        "phases": [
          {
            "id": "phase-1",
            "title": "Foundation",
            "description": "Basic concepts and fundamentals",
            "duration": "2-3 weeks",
            "tasks": [
              {
                "id": "task-1",
                "title": "Learn basic concepts",
                "description": "Understand the fundamentals",
                "status": "pending"
              }
            ]
          }
        ]
      }
    }
    
    Please create:
    - 3-4 learning phases (Foundation, Intermediate, Advanced, etc.)
    - Each phase should have 3-5 specific tasks
    - Include realistic time estimates
    - Make it actionable and practical
    - Return only valid JSON without additional text
    `;

    const result = await model.generateContent(roadmapPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    console.log('Using fallback roadmap');
    return createFallbackRoadmap(topic);
  }
};

module.exports = {
  generateMindMap,
  generateResources,
  generateRoadmap
}; 