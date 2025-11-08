"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  IconUpload,
  IconDownload,
  IconPlus,
  IconUsers,
  IconTrash,
  IconEdit,
  IconFileSpreadsheet,
  IconCheck,
  IconX,
  IconAlertTriangle
} from "@tabler/icons-react"
import { toast } from "sonner"

const studentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  nisn: z.string().min(1, "NISN is required").max(20, "NISN too long"),
  dateOfBirth: z.string().refine((date) => {
    const parsed = new Date(date)
    return !isNaN(parsed.getTime()) && parsed < new Date()
  }, "Valid date of birth is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type StudentForm = z.infer<typeof studentSchema>

interface Student {
  id: string
  name: string
  nisn: string
  dateOfBirth: string
  createdAt: string
  hasTakenExams: boolean
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    nisn: "20230001",
    dateOfBirth: "2005-03-15",
    createdAt: "2024-01-15",
    hasTakenExams: true
  },
  {
    id: "2",
    name: "Bob Smith",
    nisn: "20230002",
    dateOfBirth: "2005-07-22",
    createdAt: "2024-01-14",
    hasTakenExams: true
  },
  {
    id: "3",
    name: "Carol Williams",
    nisn: "20230003",
    dateOfBirth: "2005-11-08",
    createdAt: "2024-01-16",
    hasTakenExams: false
  },
  {
    id: "4",
    name: "David Brown",
    nisn: "20230004",
    dateOfBirth: "2005-01-30",
    createdAt: "2024-01-13",
    hasTakenExams: true
  },
  {
    id: "5",
    name: "Emma Davis",
    nisn: "20230005",
    dateOfBirth: "2005-09-12",
    createdAt: "2024-01-12",
    hasTakenExams: false
  }
]

export function StudentRegistration() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      nisn: "",
      dateOfBirth: "",
      password: "",
    },
  })

  const onSubmit = async (data: StudentForm) => {
    setIsSubmitting(true)
    try {
      // TODO: Create student in database
      const newStudent: Student = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        hasTakenExams: false
      }

      if (editingStudent) {
        // Update existing student
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? newStudent : s))
        toast.success("Student updated successfully!")
      } else {
        // Check for duplicate NISN
        if (students.some(s => s.nisn === data.nisn)) {
          toast.error("A student with this NISN already exists")
          return
        }

        setStudents(prev => [...prev, newStudent])
        toast.success("Student registered successfully!")
      }

      // Reset form and close dialog
      form.reset()
      setIsDialogOpen(false)
      setEditingStudent(null)
    } catch (error) {
      toast.error("Failed to register student")
      console.error("Error registering student:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    form.reset({
      name: student.name,
      nisn: student.nisn,
      dateOfBirth: student.dateOfBirth,
      password: "", // Don't pre-fill password for security
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId)
      if (student?.hasTakenExams) {
        toast.error("Cannot delete student who has taken exams")
        return
      }

      setStudents(prev => prev.filter(s => s.id !== studentId))
      toast.success("Student deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete student")
      console.error("Error deleting student:", error)
    }
  }

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "Name,NISN,Date of Birth (YYYY-MM-DD),Password\n" +
                      "John Doe,20230001,2005-01-01,password123\n" +
                      "Jane Smith,20230002,2005-02-01,password123"

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_registration_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Template downloaded successfully!")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',')

        const newStudents: Student[] = []

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',')
            if (values.length >= 4) {
              const newStudent: Student = {
                id: Date.now().toString() + i,
                name: values[0].trim(),
                nisn: values[1].trim(),
                dateOfBirth: values[2].trim(),
                createdAt: new Date().toISOString().split('T')[0],
                hasTakenExams: false
              }
              newStudents.push(newStudent)
            }
          }
        }

        if (newStudents.length > 0) {
          // Check for duplicates
          const duplicates = newStudents.filter(ns =>
            students.some(s => s.nisn === ns.nisn)
          )

          if (duplicates.length > 0) {
            toast.warning(`${duplicates.length} students skipped due to duplicate NISN`)
          }

          const validStudents = newStudents.filter(ns =>
            !students.some(s => s.nisn === ns.nisn)
          )

          setStudents(prev => [...prev, ...validStudents])
          toast.success(`${validStudents.length} students imported successfully!`)
        }
      } catch (error) {
        toast.error("Failed to parse CSV file")
        console.error("Error parsing CSV:", error)
      }
    }
    reader.readAsText(file)

    // Reset file input
    event.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.hasTakenExams).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Have taken exams
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Students</CardTitle>
            <IconPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => !s.hasTakenExams).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Haven't taken exams yet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="import">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Registered Students</CardTitle>
                <CardDescription>
                  Manage student accounts and exam access
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingStudent(null)}>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingStudent ? "Edit Student" : "Register New Student"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingStudent
                        ? "Update the student's information below."
                        : "Enter the student's information to register them for the exam system."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter student's full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nisn"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NISN/ID *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Student ID number"
                                  {...field}
                                  disabled={!!editingStudent} // Don't allow editing NISN
                                />
                              </FormControl>
                              <FormDescription>
                                {editingStudent ? "NISN cannot be changed" : "Unique student identifier"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password *</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Student password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {editingStudent ? "Leave blank to keep current password" : "At least 6 characters"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false)
                            setEditingStudent(null)
                            form.reset()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : editingStudent ? "Update" : "Register"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>NISN/ID</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.nisn}</TableCell>
                      <TableCell>{student.dateOfBirth}</TableCell>
                      <TableCell>
                        <Badge variant={student.hasTakenExams ? "default" : "secondary"}>
                          {student.hasTakenExams ? "Active" : "New"}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student)}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={student.hasTakenExams}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {student.hasTakenExams
                                    ? "This student has taken exams and cannot be deleted to preserve exam records."
                                    : "This will permanently delete the student's account. This action cannot be undone."
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(student.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={student.hasTakenExams}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Student Import</CardTitle>
              <CardDescription>
                Import multiple students at once using a CSV file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Download */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <IconFileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Download Template</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Start with our CSV template to ensure your data is formatted correctly.
                </p>
                <Button onClick={downloadTemplate} variant="outline">
                  <IconDownload className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              {/* File Upload */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <IconUpload className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Upload CSV File</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload your completed CSV file with student information.
                </p>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <IconFileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Choose a CSV file or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV files with columns: Name, NISN, Date of Birth, Password
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <IconAlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium">Important Notes</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>NISN must be unique for each student</li>
                  <li>Date of birth should be in YYYY-MM-DD format</li>
                  <li>Passwords should be at least 6 characters long</li>
                  <li>Duplicate NISN entries will be skipped during import</li>
                  <li>Students who have taken exams cannot be deleted</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}