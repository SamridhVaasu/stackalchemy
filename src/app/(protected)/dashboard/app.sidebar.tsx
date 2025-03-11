'use client'

import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, Trash2 } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useProject } from "@/hooks/use-project"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const items = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard'
  },
  {
    title: 'Q&A',
    icon: Bot,
    url: '/qa'
  },
  {
    title: 'Meetings',
    icon: Presentation,
    url: '/meetings'
  },
  {
    title: 'Billing',
    icon: CreditCard,
    url: '/billing'
  }
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { projects, projectId, setProjectId } = useProject()
  const { toast } = useToast()
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const utils = api.useUtils()
  const deleteProjectMutation = api.project.deleteProject.useMutation({
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })
      if (projectId === projectToDelete) {
        // If the currently selected project was deleted, clear the selection
        setProjectId(projects?.[0]?.id ?? '')
      }
      // Refetch the projects list
      void utils.project.getProjects.invalidate()
      setIsDeleteDialogOpen(false)
    },
    onError: (error) => {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive"
      })
      setIsDeleteDialogOpen(false)
    }
  })

  const handleDeleteProject = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    setProjectToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate({ projectId: projectToDelete })
    }
  }

  return (
    <>
      <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-3">
            {/* Modern logo with gradient border */}
            <div className="w-10 h-10 p-0.5 bg-gradient-to-br from-primary to-secondary rounded-full">
              <img 
                src="logo.jpeg" 
                alt="StackAlchemy Logo" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            {state === "expanded" && (
              <h1 className="text-lg font-bold text-primary">StackAlchemy</h1>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        href={item.url} 
                        className={cn(
                          { '!bg-primary !text-white': pathname === item.url }, 
                          'list-none flex items-center gap-2 transition-colors duration-200'
                        )}
                      >
                        <item.icon size={18} />
                        {state === "expanded" && item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects?.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <div className="flex items-center justify-between w-full px-2 py-1.5">
                      <SidebarMenuButton asChild>
                        <div 
                          onClick={() => setProjectId(project.id)}
                          className="flex items-center gap-2 flex-grow cursor-pointer"
                        >
                          <div
                            className={cn(
                              'rounded-sm border w-6 h-6 flex items-center justify-center text-sm',
                              'bg-white text-primary',
                              {
                                'bg-primary text-white': project.id === projectId
                              }
                            )}
                          >
                            {project.name?.[0]}
                          </div>
                          {state === "expanded" && <span>{project.name}</span>}
                        </div>
                      </SidebarMenuButton>
                      {state === "expanded" && (
                        <span 
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-sm cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </span>
                      )}
                    </div>
                  </SidebarMenuItem>
                ))}
                {state === "expanded" && (
                  <>
                    <div className="h-2"></div>
                    <SidebarMenuItem>
                      <Link href='/create'>
                        <Button variant="outline" className="w-fit flex items-center gap-1">
                          <Plus size={16} />
                          Create Project
                        </Button>
                      </Link>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
