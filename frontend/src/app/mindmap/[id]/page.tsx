'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

interface MindMapData {
  root: {
    id: string
    text: string
    children?: Array<{
      id: string
      text: string
      children?: Array<{
        id: string
        text: string
        children?: Array<{
          id: string
          text: string
        }>
      }>
    }>
  }
}

interface MindMap {
  id: string
  title: string
  data: MindMapData
  createdAt: string
}

interface Resource {
  type: string
  title: string
  description: string
  url: string
  platform: string
}

interface RoadmapPhase {
  id: string
  title: string
  description: string
  duration: string
  tasks: Array<{
    id: string
    title: string
    description: string
    status: string
  }>
}

interface Roadmap {
  title: string
  phases: RoadmapPhase[]
}

export default function MindMapPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mindMap, setMindMap] = useState<MindMap | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [activeTab, setActiveTab] = useState('mindmap')
  const [loadingMap, setLoadingMap] = useState(true)
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingRoadmap, setLoadingRoadmap] = useState(false)
  const [error, setError] = useState('')

  const mindMapId = params.id as string

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user && mindMapId) {
      fetchMindMap()
    }
  }, [user, loading, mindMapId, router])

  const fetchMindMap = async () => {
    try {
      const response = await apiClient.getMindMap(mindMapId)
      if (response.data?.mindMap) {
        setMindMap(response.data.mindMap)
      }
    } catch (err: any) {
      setError('Failed to load mind map')
      console.error('Error fetching mind map:', err)
    } finally {
      setLoadingMap(false)
    }
  }

  const fetchResources = async () => {
    if (resources.length > 0) return // Already loaded
    
    setLoadingResources(true)
    try {
      const response = await apiClient.generateResources(mindMapId)
      if (response.data?.resources) {
        setResources(response.data.resources)
      }
    } catch (err: any) {
      console.error('Error fetching resources:', err)
    } finally {
      setLoadingResources(false)
    }
  }

  const fetchRoadmap = async () => {
    if (roadmap) return // Already loaded
    
    setLoadingRoadmap(true)
    try {
      const response = await apiClient.generateRoadmap(mindMapId)
      if (response.data?.roadmap) {
        setRoadmap(response.data.roadmap)
      }
    } catch (err: any) {
      console.error('Error fetching roadmap:', err)
    } finally {
      setLoadingRoadmap(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'resources') {
      fetchResources()
    } else if (tab === 'roadmap') {
      fetchRoadmap()
    }
  }

  const renderNode = (node: any, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    
    return (
      <div key={node.id} className="relative">
        <div className={`flex items-center ${level > 0 ? 'ml-6 sm:ml-8' : ''}`}>
          {level > 0 && (
            <div className="absolute left-0 top-1/2 w-4 sm:w-6 h-px bg-gray-300 transform -translate-y-1/2"></div>
          )}
          <div className={`flex items-center space-x-3 p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${level === 0 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              level === 0 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {level === 0 ? '🎯' : level === 1 ? '📌' : '•'}
            </div>
            <span className={`font-medium text-gray-900 ${level === 0 ? 'text-lg' : 'text-base'}`}>
              {node.text}
            </span>
          </div>
        </div>
        
        {hasChildren && (
          <div className="mt-4 space-y-4">
            {node.children.map((child: any) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Mind Map</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindMapGPT
              </span>
            </div>
          </div>
          {mindMap && (
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
              {mindMap.title}
            </h1>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {loadingMap ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : mindMap ? (
            <>
              {/* Tabs */}
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {[
                      { id: 'mindmap', label: 'Mind Map', icon: '🧠' },
                      { id: 'resources', label: 'Resources', icon: '📚' },
                      { id: 'roadmap', label: 'Learning Roadmap', icon: '🗺️' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:text-base transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                {activeTab === 'mindmap' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        {mindMap.title}
                      </h2>
                      <p className="text-gray-600">
                        Created {new Date(mindMap.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      {mindMap.data.root && renderNode(mindMap.data.root)}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                      Learning Resources
                    </h2>
                    
                    {loadingResources ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : resources.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((resource, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                          >
                            <div className="flex items-start space-x-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                resource.type === 'video' ? 'bg-red-500' :
                                resource.type === 'article' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}>
                                <span className="text-white text-lg">
                                  {resource.type === 'video' ? '🎥' :
                                   resource.type === 'article' ? '📄' : '📚'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                  {resource.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {resource.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                    {resource.platform}
                                  </span>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                  >
                                    Open →
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources available</h3>
                        <p className="text-gray-600">Resources will be generated when you view this tab.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'roadmap' && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                      Learning Roadmap
                    </h2>
                    
                    {loadingRoadmap ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : roadmap ? (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {roadmap.title}
                          </h3>
                          <p className="text-gray-600">
                            Follow this structured learning path to master the topic
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          {roadmap.phases.map((phase, phaseIndex) => (
                            <div key={phase.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                              <div className="flex items-start space-x-4 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {phaseIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {phase.title}
                                  </h4>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {phase.description}
                                  </p>
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {phase.duration}
                                  </span>
                                </div>
                              </div>
                              
                              {phase.tasks.length > 0 && (
                                <div className="ml-14 space-y-3">
                                  {phase.tasks.map((task) => (
                                    <div key={task.id} className="flex items-start space-x-3">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900 text-sm">
                                          {task.title}
                                        </h5>
                                        <p className="text-gray-600 text-xs">
                                          {task.description}
                                        </p>
                                      </div>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        task.status === 'completed' 
                                          ? 'bg-green-100 text-green-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {task.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🗺️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No roadmap available</h3>
                        <p className="text-gray-600">Roadmap will be generated when you view this tab.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mind map not found</h3>
              <p className="text-gray-600 mb-6">The mind map you're looking for doesn't exist or you don't have access to it.</p>
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 