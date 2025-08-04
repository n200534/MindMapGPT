'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">MindMapGPT</h1>
        <nav className="space-x-6 text-gray-500 font-medium">
          <Link href="/auth/login" className="hover:text-black">Login</Link>
          <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-20 bg-gradient-to-b from-[#f7faff] to-white">
        <h2 className="text-4xl font-bold mb-4">MindMapGPT</h2>
        <p className="text-gray-600 max-w-2xl mb-6">
          Turn vague ideas into structured plans using AI-powered mind maps,
          curated resources, and project roadmaps.
        </p>
        <div className="space-x-4">
          <Link
            href="/auth/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium border border-indigo-600 hover:bg-indigo-50 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-16 max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-12">What You Can Do</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "🧠 AI-Powered Mind Maps",
              desc: "Just type an idea. MindMapGPT creates a mind map with expandable nodes.",
            },
            {
              title: "📚 Curated Resources",
              desc: "Get hand-picked YouTube videos, GitHub projects, and docs for every concept.",
            },
            {
              title: "📈 Project Roadmaps",
              desc: "Auto-generate timelines and phases for building out your idea.",
            },
            {
              title: "✅ Kanban Task Boards",
              desc: "Convert roadmap steps into actionable tasks in Trello or in-app board.",
            },
            {
              title: "🗂️ Export & Share",
              desc: "Export your mind map, roadmap, or task board to PDF, Markdown, or PNG.",
            },
            {
              title: "💾 Save & Resume",
              desc: "Sign in to save your maps and pick up where you left off anytime.",
            },
          ].map(({ title, desc }, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold mb-2">{title}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating amazing mind maps with AI assistance.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-indigo-50 transition"
          >
            Create Your First Mind Map
          </Link>
        </div>
      </section>
    </main>
  );
}
