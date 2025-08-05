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
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'YouTube'
      },
      {
        type: 'article',
        title: `${topic} Fundamentals`,
        description: `A detailed guide covering the core concepts of ${topic}`,
        url: 'https://medium.com/topic/programming',
        platform: 'Medium'
      },
      {
        type: 'documentation',
        title: `${topic} Official Documentation`,
        description: `Official documentation and guides for ${topic}`,
        url: 'https://developer.mozilla.org/en-US/',
        platform: 'MDN Web Docs'
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
    For the topic "${topic}", provide a curated list of REAL learning resources with ACTUAL URLs. Do NOT use example.com or placeholder URLs. Use real, existing resources.

    Please provide resources in the following JSON format:
    
    {
      "resources": [
        {
          "type": "video",
          "title": "Real Video Title",
          "description": "Brief description of the video content",
          "url": "https://www.youtube.com/watch?v=ACTUAL_VIDEO_ID",
          "platform": "YouTube"
        },
        {
          "type": "article",
          "title": "Real Article Title", 
          "description": "Brief description of the article",
          "url": "https://real-website.com/actual-article",
          "platform": "Real Platform Name"
        },
        {
          "type": "documentation",
          "title": "Real Documentation Title",
          "description": "Brief description of the documentation", 
          "url": "https://docs.real-platform.com/actual-docs",
          "platform": "Real Platform Documentation"
        }
      ]
    }
    
    IMPORTANT REQUIREMENTS:
    1. Use ONLY real, existing URLs - NO example.com, placeholder, or fake URLs
    2. For YouTube videos, use actual video IDs from real educational content
    3. For documentation, use official documentation sites (MDN, React docs, Python docs, etc.)
    4. For articles, use real tech blogs, Medium articles, or educational websites
    5. Focus on high-quality, educational content
    6. Make sure all URLs are accessible and real
    7. Return only valid JSON without additional text
    
    Examples of good platforms:
    - YouTube: Real educational channels
    - Documentation: MDN Web Docs, React Documentation, Python Documentation, etc.
    - Articles: Medium, Dev.to, CSS-Tricks, Smashing Magazine, etc.
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