"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ label, value, onChange, placeholder = "Add tag" }: TagInputProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
        />
        <Button type="button" onClick={addTag}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}