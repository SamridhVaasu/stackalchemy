'use client'

/**
 * AskQuestionCard Component
 * 
 * A React component that provides a user interface for asking AI-powered questions about the codebase.
 * Features include:
 * - Question input with example suggestions
 * - AI-generated answers with markdown support
 * - Code references from relevant files
 * - Copy-to-clipboard functionality
 * - Loading states and animations
 */

import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useProject } from '@/hooks/use-project'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from './code-references'
import { Loader2, Search, Lightbulb, Code, X, Copy, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { toast } from 'sonner'

// Define the type for file references to fix type errors
type FileReference = {
  fileName: string;
  sourceCode: string;
  summary: string;
}

const AskQuestionCard = () => {
  const { project } = useProject()
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [filesReferences, setFilesReferences] = useState<FileReference[]>([])
  const [answer, setAnswer] = useState('')
  const [activeTab, setActiveTab] = useState('answer')
  const [copied, setCopied] = useState(false)
  
  // Example questions that users can click to quickly ask
  const [recentQuestions] = useState<string[]>([
    'How do I implement authentication?',
    'Where is the database schema defined?',
    'How can I add a new page to the app?'
  ])

  // Refs for DOM elements
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const answerRef = useRef<HTMLDivElement>(null)
  
  // tRPC mutation for saving answers
  const saveAnswer = api.project.saveAnswer.useMutation()

  // Apply styling to code blocks in the answer
  useEffect(() => {
    if (answer && answerRef.current) {
      const codeBlocks = answerRef.current.querySelectorAll('pre')
      codeBlocks.forEach(block => {
        block.classList.add('relative', 'rounded-md', 'overflow-hidden')
      })
    }
  }, [answer])

  /**
   * Copy the current answer to clipboard
   */
  const copyToClipboard = () => {
    if (answer) {
      navigator.clipboard.writeText(answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  /**
   * Handle form submission and question answering
   */
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!project?.id || !question.trim()) return
    
    // Reset previous results
    setAnswer('')
    setFilesReferences([])
    setLoading(true)
    setActiveTab('answer')
    
    try {
      // Call the server action to ask the question
      const { output, filesReferences } = await askQuestion(question, project.id)
      setFilesReferences(filesReferences)
      
      // Stream the answer text as it's generated
      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAnswer(ans => ans + delta)
        }
      }
      
      // Open the response dialog once we have content
      setOpen(true)
    } catch (error) {
      console.error("Error asking question:", error)
      toast.error("Failed to get an answer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Use an example question from the provided list
   */
  const useExampleQuestion = (example: string) => {
    setQuestion(example)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  return (
    <>
      {/* Response Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-hidden rounded-xl p-0 border-2 border-primary/20">
          <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/20 via-purple-500/10 to-secondary/20">
            <div className='flex items-center justify-between'>
              <DialogTitle className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-primary/30 p-1.5 ring-2 ring-primary/20">
                  <Image
                    src="/logo.jpeg"
                    alt="StackAlchemy logo"
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                  />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  StackAlchemy Response
                </span>
              </DialogTitle>
              
              {/* Save Answer Button */}
              <Button 
                disabled={saveAnswer.isPending} 
                variant="outline"
                className="hover:bg-primary/10 border-2 border-primary/30 text-primary"
                onClick={() => saveAnswer.mutate(
                  {
                    projectId: project?.id || "",
                    question,
                    answer: answer || "",
                    filesReferences
                  },
                  {
                    onSuccess: () => toast.success('Answer saved successfully'),
                    onError: () => toast.error('Failed to save answer')
                  }
                )}
              >
                {saveAnswer.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Save Answer
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 p-6 overflow-auto max-h-[60vh]">
            {/* User's Question Section */}
            <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/30">
              <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Search className="h-4 w-4" /> Your Question:
              </p>
              <p className="text-foreground">{question}</p>
            </div>
            
            {/* Answer and References Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="answer" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Lightbulb className="h-4 w-4 mr-2" /> Answer
                </TabsTrigger>
                <TabsTrigger value="references" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Code className="h-4 w-4 mr-2" /> Code References {filesReferences.length > 0 && `(${filesReferences.length})`}
                </TabsTrigger>
              </TabsList>
              
              {/* Answer Content */}
              <TabsContent value="answer" className="mt-0">
                {answer ? (
                  <div className="rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-muted-foreground">Answer:</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8">
                              {copied ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                              {copied ? 'Copied' : 'Copy'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy answer to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div 
                      ref={answerRef}
                      className="bg-background border rounded-md overflow-hidden shadow-sm hover:shadow transition-shadow"
                    >
                      <MDEditor.Markdown
                        source={answer}
                        className="prose dark:prose-invert max-w-full p-4"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-secondary/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Loading answer...</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Code References Content */}
              <TabsContent value="references" className="mt-0">
                {filesReferences.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Referenced Files:
                    </p>
                    <CodeReferences filesReferences={filesReferences} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-secondary/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No code references available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="p-6 border-t">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Input Card */}
      <Card className="col-span-5 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-purple-50 dark:from-secondary/5 dark:to-primary/5">
        <CardHeader className="pb-6 bg-gradient-to-r from-primary/10 via-purple-500/5 to-secondary/10 border-b border-primary/10">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Search className="h-7 w-7 text-primary" />
            Ask StackAlchemy
          </CardTitle>
          <CardDescription className="text-primary/70 text-base mt-2">
            Get instant, AI-powered answers about your codebase
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Question Input Field */}
            <div className="relative">
              <Textarea 
                ref={textareaRef}
                placeholder="Ask anything about your code..." 
                value={question} 
                onChange={e => setQuestion(e.target.value)}
                className={cn(
                  "resize-none min-h-[120px] focus-visible:ring-primary focus-visible:ring-2 pr-10 rounded-xl border-2 text-base",
                  question ? "border-primary/30" : "border-primary/10"
                )}
              />
              {question && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full hover:bg-primary/10"
                  onClick={() => setQuestion('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Example Questions */}
            {recentQuestions.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-primary/70 font-medium">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {recentQuestions.map((q, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors border-2 border-primary/20 px-4 py-1.5 text-sm"
                      onClick={() => useExampleQuestion(q)}
                    >
                      {q}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Submit Button with Animation */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  type="submit" 
                  disabled={loading || !question.trim()} 
                  className={cn(
                    "w-full sm:w-auto bg-primary hover:bg-primary/90 transition-all duration-300 rounded-xl text-base px-6 py-5 h-auto",
                    loading ? "sm:w-48" : "sm:w-auto"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Ask Question
                    </>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard