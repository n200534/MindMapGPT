'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface MindMapNode {
  id: string;
  text: string;
  children?: MindMapNode[];
}

interface MindMapData {
  root: MindMapNode;
  prompt: string;
}

interface MindMap {
  id: string;
  title: string;
  data: MindMapData;
  createdAt: string;
}

interface Resource {
  type: string;
  title: string;
  description: string;
  url: string;
  platform: string;
}

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
  }>;
}

interface Roadmap {
  title: string;
  phases: RoadmapPhase[];
}

export default function MindMapPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [mindMap, setMindMap] = useState<MindMap | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [error, setError] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState<'mindmap' | 'resources' | 'roadmap'>('mindmap');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.id) {
      loadMindMap();
    }
  }, [user, params.id]);

  const loadMindMap = async () => {
    try {
      const response = await apiClient.getMindMap(params.id as string);
      if (response.data) {
        setMindMap(response.data.mindMap);
      } else {
        setError('Mind map not found');
      }
    } catch (error) {
      console.error('Failed to load mind map:', error);
      setError('Failed to load mind map');
    } finally {
      setLoadingMap(false);
    }
  };

  const loadResources = async () => {
    if (!mindMap) return;
    
    setLoadingResources(true);
    try {
      const response = await apiClient.generateResources(mindMap.id);
      if (response.data) {
        setResources(response.data.resources);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoadingResources(false);
    }
  };

  const loadRoadmap = async () => {
    if (!mindMap) return;
    
    setLoadingRoadmap(true);
    try {
      const response = await apiClient.generateRoadmap(mindMap.id);
      if (response.data) {
        setRoadmap(response.data.roadmap);
      }
    } catch (error) {
      console.error('Failed to load roadmap:', error);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const renderNode = (node: MindMapNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="relative">
        <div className="flex items-center">
          {/* Indent based on level */}
          <div style={{ width: `${level * 40}px` }}></div>
          
          {/* Node content */}
          <div className="flex items-center">
            {hasChildren && (
              <div className="w-6 h-6 mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-gray-900 font-medium">{node.text}</span>
            </div>
          </div>
        </div>
        
        {/* Children */}
        {hasChildren && (
          <div className="mt-2">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loadingMap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mind map...</p>
        </div>
      </div>
    );
  }

  if (!mindMap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mind Map Not Found</h2>
          <p className="text-gray-600 mb-4">The mind map you're looking for doesn't exist.</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{mindMap.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-medium text-blue-900 mb-1">Original Prompt</h3>
          <p className="text-blue-800">{mindMap.data.prompt}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mindmap'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mind Map
            </button>
            <button
              onClick={() => {
                setActiveTab('resources');
                if (resources.length === 0) loadResources();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => {
                setActiveTab('roadmap');
                if (!roadmap) loadRoadmap();
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roadmap'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Learning Roadmap
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'mindmap' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mind Map Structure</h2>
            <div className="space-y-4">
              {renderNode(mindMap.data.root)}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Resources</h2>
            {loadingResources ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating resources...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.type === 'video' ? 'bg-red-100 text-red-800' :
                        resource.type === 'article' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resource.type}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">{resource.platform}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Resource →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No resources available. Click the Resources tab to generate them.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Roadmap</h2>
            {loadingRoadmap ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating roadmap...</p>
              </div>
            ) : roadmap ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">{roadmap.title}</h3>
                {roadmap.phases.map((phase, index) => (
                  <div key={phase.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{phase.title}</h4>
                        <p className="text-sm text-gray-600">{phase.description}</p>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">{phase.duration}</span>
                    </div>
                    <div className="space-y-2">
                      {phase.tasks.map((task) => (
                        <div key={task.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                          <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{task.title}</p>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No roadmap available. Click the Learning Roadmap tab to generate it.</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Export as PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Edit Mind Map
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors">
            Share
          </button>
        </div>
      </main>
    </div>
  );
} 