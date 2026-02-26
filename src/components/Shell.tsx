'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronRight, ChevronDown, ExternalLink, BookOpen } from 'lucide-react';
import { KnowledgeHubData, Category, SubCategory } from '@/lib/parser';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ShellProps {
  data: KnowledgeHubData;
}

export default function Shell({ data }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(Object.keys(data));
  const [activeSelection, setActiveSelection] = useState<{ category: string, subCategory: string } | null>(null);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const currentArticles = activeSelection
    ? data[activeSelection.category]?.subCategories[activeSelection.subCategory]?.articles || []
    : [];

  const currentSubCategory = activeSelection
    ? data[activeSelection.category]?.subCategories[activeSelection.subCategory]
    : null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <BookOpen size={24} />
              <span>Knowledge Hub</span>
            </h1>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {Object.entries(data).map(([catTitle, category]) => (
              <div key={catTitle} className="space-y-1">
                <button
                  onClick={() => toggleCategory(catTitle)}
                  className="flex items-center justify-between w-full p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-md group"
                >
                  <span className="flex items-center gap-2">
                    {expandedCategories.includes(catTitle) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {catTitle}
                  </span>
                </button>

                {expandedCategories.includes(catTitle) && (
                  <div className="ml-4 pl-2 border-l border-slate-100 space-y-1 mt-1">
                    {Object.entries(category.subCategories).map(([subTitle, subCat]) => (
                      <button
                        key={subTitle}
                        onClick={() => {
                          setActiveSelection({ category: catTitle, subCategory: subTitle });
                          setIsSidebarOpen(false);
                        }}
                        className={cn(
                          "w-full text-left p-2 text-sm rounded-md transition-colors",
                          activeSelection?.category === catTitle && activeSelection?.subCategory === subTitle
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {subTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-16 flex items-center px-6 bg-white border-b border-slate-200 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-semibold text-slate-900">Kim7s Knowledge Hub</span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            {!activeSelection ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 mb-6">
                  <BookOpen size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to the Knowledge Hub</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Your curated collection of essential technical articles and resources. 
                  Select a section from the sidebar to explore.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 text-left">
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">🛠️ Tools</h3>
                    <p className="text-slate-600 text-sm">Kubernetes, Grafana, ELK Stack and more</p>
                  </div>
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">💻 Languages</h3>
                    <p className="text-slate-600 text-sm">Essential resources for JS, Java, and YAML</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wider">
                    {activeSelection.category}
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-900">{currentSubCategory?.title}</h2>
                </div>

                <div className="grid gap-6">
                  {currentArticles.length > 0 ? (
                    currentArticles.map((article, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {article.title}
                            <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">
                          {article.description}
                        </p>
                        {article.myThoughts && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                            <h4 className="text-sm font-bold text-slate-900 mb-1 uppercase">My Thoughts</h4>
                            <p className="text-slate-700 text-sm italic italic leading-relaxed">
                              "{article.myThoughts}"
                            </p>
                          </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-medium">{article.name}</span>
                          <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            Read Full Article <ChevronRight size={14} />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
                      <div className="text-4xl mb-4">🚧</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Under Development</h3>
                      <p className="text-slate-600">Content will be added soon!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
