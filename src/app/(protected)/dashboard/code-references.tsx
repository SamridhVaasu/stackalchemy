'use client'
import React, { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'
import { Copy, Check, FileCode, ChevronLeft, ChevronRight, Code, FileText, Hash } from 'lucide-react'

type FileReference = {
  fileName: string
  sourceCode: string
  summary: string
  language?: string
}

type Props = {
  filesReferences: FileReference[]
  defaultTab?: string
  maxHeight?: string
  showCopyButton?: boolean
  showLineNumbers?: boolean
  theme?: any
}

const CodeReferences = ({ 
  filesReferences, 
  defaultTab,
  maxHeight = '100%', // Changed from '50vh' to '100%' to show all code
  showCopyButton = true,
  showLineNumbers = true,
  theme = vscDarkPlus
}: Props) => {
  const [activeTab, setActiveTab] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'code' | 'summary'>('code')

  // Determine file language based on extension
  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    const extensionMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'rb': 'ruby',
      'java': 'java',
      'php': 'php',
      'go': 'go',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
    }
    return extensionMap[extension] || 'typescript'
  }

  // Get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) return <Code className="h-4 w-4" />
    if (['html', 'css', 'scss'].includes(extension)) return <FileCode className="h-4 w-4" />
    if (['md', 'txt'].includes(extension)) return <FileText className="h-4 w-4" />
    if (['json', 'yaml', 'yml'].includes(extension)) return <Hash className="h-4 w-4" />
    
    return <FileCode className="h-4 w-4" />
  }

  // Initialize active tab
  useEffect(() => {
    if (filesReferences.length > 0) {
      setActiveTab(defaultTab || filesReferences[0].fileName)
      setActiveFileIndex(0)
    }
  }, [filesReferences, defaultTab])

  // Navigate between files
  const navigateFiles = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (activeFileIndex + 1) % filesReferences.length
      : (activeFileIndex - 1 + filesReferences.length) % filesReferences.length
    
    setActiveFileIndex(newIndex)
    setActiveTab(filesReferences[newIndex].fileName)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (filesReferences.length === 0) return null

  // Find the active file based on the active tab name
  const activeFile = filesReferences.find(file => file.fileName === activeTab) || filesReferences[activeFileIndex]

  return (
    <div className="w-full border rounded-xl shadow-xl bg-gray-900 overflow-hidden border-purple-800">
      {/* Header with enhanced styling - Removed search bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900 to-purple-800 border-b border-purple-700">
        <div className="flex items-center space-x-2">
          <FileCode className="h-5 w-5 text-purple-300" />
          <h3 className="text-sm font-medium text-white">Code Explorer</h3>
        </div>
        
        {/* View mode toggle */}
        <div className="flex space-x-1 bg-purple-950 rounded-md p-1">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'code' 
                ? 'bg-purple-700 text-white' 
                : 'text-purple-300 hover:text-white'
            }`}
            onClick={() => setViewMode('code')}
          >
            Code
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              viewMode === 'summary' 
                ? 'bg-purple-700 text-white' 
                : 'text-purple-300 hover:text-white'
            }`}
            onClick={() => setViewMode('summary')}
          >
            Summary
          </button>
        </div>
      </div>

      {/* Navigation arrows and enhanced file tabs */}
      <div className="flex items-center bg-gray-800 border-b border-purple-800">
        <button 
          onClick={() => navigateFiles('prev')}
          className="p-2 text-purple-400 hover:text-purple-200 focus:outline-none hover:bg-purple-900 rounded-md m-1"
          aria-label="Previous file"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-700">
          <div className="flex">
            {filesReferences.map((file, index) => (
              <button
                key={file.fileName}
                onClick={() => {
                  setActiveTab(file.fileName)
                  setActiveFileIndex(index)
                }}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-1',
                  {
                    'text-white border-b-2 border-purple-500 bg-purple-900/30': activeTab === file.fileName,
                    'text-purple-400 hover:text-purple-200 hover:bg-purple-900/20': activeTab !== file.fileName,
                  }
                )}
              >
                {getFileIcon(file.fileName)}
                <span className="ml-1">{file.fileName}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => navigateFiles('next')}
          className="p-2 text-purple-400 hover:text-purple-200 focus:outline-none hover:bg-purple-900 rounded-md m-1"
          aria-label="Next file"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Content area - conditionally show summary or code */}
      {viewMode === 'summary' && activeFile.summary ? (
        <div className="p-6 bg-gray-900 text-purple-100 overflow-auto">
          <h4 className="text-lg font-medium text-purple-300 mb-3">{activeFile.fileName} - Overview</h4>
          <p className="leading-relaxed">{activeFile.summary}</p>
        </div>
      ) : (
        <div 
          key={activeTab}
          className="relative"
        >
          {showCopyButton && (
            <button
              onClick={() => handleCopyCode(activeFile.sourceCode)}
              className="absolute top-3 right-3 p-2 rounded-md bg-purple-800 text-white hover:bg-purple-700 z-10 transition-colors shadow-lg"
              title="Copy code"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          )}
          
          <div className="overflow-auto">
            <SyntaxHighlighter
              language={activeFile.language || getLanguage(activeFile.fileName)}
              style={theme}
              showLineNumbers={showLineNumbers}
              wrapLines={true}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '0.9rem',
                backgroundColor: '#111827', // Dark background
                maxHeight: 'none', // Remove height limitation
              }}
              codeTagProps={{
                style: {
                  fontFamily: '"Fira Code", monospace',
                }
              }}
              lineNumberStyle={{
                color: '#6B46C1', // Purple line numbers
                opacity: 0.5,
              }}
            >
              {activeFile.sourceCode}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Footer with metadata */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-t border-purple-800 text-xs text-purple-400">
        <div>
          {activeFile.language || getLanguage(activeFile.fileName)}
        </div>
        <div>
          {activeFile.sourceCode.split('\n').length} lines
        </div>
      </div>
    </div>
  )
}

export default CodeReferences