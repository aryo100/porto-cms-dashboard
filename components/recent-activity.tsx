"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronRight } from "lucide-react"

interface RecentActivityItem {
  id: number
  title: string
  type: "Project" | "Blog Post" | "Certificate" | "Experience"
  status: string
  lastModified: string
  views: number
  target: string
}

const recentItems: RecentActivityItem[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    type: "Project",
    status: "Completed",
    lastModified: "2 hours ago",
    views: 234,
    target: "/projects?focus=1",
  },
  {
    id: 2,
    title: "Mastering React Hooks: A Deep Dive",
    type: "Blog Post",
    status: "Published",
    lastModified: "1 day ago",
    views: 3200,
    target: "/blog?focus=1",
  },
  {
    id: 3,
    title: "Google Cloud Certified Professional Developer",
    type: "Certificate",
    status: "Published",
    lastModified: "3 days ago",
    views: 89,
    target: "/experience?focus=1&type=achievement",
  },
  {
    id: 4,
    title: "Senior Software Engineer",
    type: "Experience",
    status: "Published",
    lastModified: "1 week ago",
    views: 156,
    target: "/experience?focus=1&type=work",
  },
]

export function RecentActivity() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentItems.map((item) => (
              <TableRow
                key={item.id}
                className="h-16 cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => router.push(item.target)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.lastModified}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "Published" ? "default" : "secondary"}
                    className={item.status === "Published" ? "bg-primary text-primary-foreground" : ""}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.views}</TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}