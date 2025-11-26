"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const recentItems = [
  {
    id: 1,
    title: "E-commerce Platform",
    type: "Project",
    status: "Published",
    lastModified: "2 hours ago",
    views: 234,
  },
  {
    id: 2,
    title: "React Best Practices",
    type: "Blog Post",
    status: "Draft",
    lastModified: "1 day ago",
    views: 0,
  },
  {
    id: 3,
    title: "AWS Solutions Architect",
    type: "Certificate",
    status: "Published",
    lastModified: "3 days ago",
    views: 89,
  },
  {
    id: 4,
    title: "Senior Frontend Developer",
    type: "Experience",
    status: "Published",
    lastModified: "1 week ago",
    views: 156,
  },
]

export function RecentActivity() {
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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentItems.map((item) => (
              <TableRow key={item.id} className="h-16">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
