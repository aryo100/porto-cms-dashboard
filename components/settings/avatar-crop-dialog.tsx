"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const SIZE = 320

interface AvatarCropDialogProps {
  file: File | null
  busy: boolean
  onClose: () => void
  onCrop: (file: File) => Promise<void>
}

export function AvatarCropDialog({ file, busy, onClose, onCrop }: AvatarCropDialogProps) {
  const [url, setUrl] = useState("")
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [error, setError] = useState("")
  const imageRef = useRef<HTMLImageElement | null>(null)
  const dragRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)

  useEffect(() => {
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    setDimensions({ width: 0, height: 0 })
    setError("")
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const baseScale = dimensions.width && dimensions.height ? Math.max(SIZE / dimensions.width, SIZE / dimensions.height) : 1
  const scale = baseScale * zoom
  const imageWidth = dimensions.width * scale
  const imageHeight = dimensions.height * scale
  const clamp = (value: number, renderedSize: number) => Math.min(0, Math.max(SIZE - renderedSize, value))
  const left = clamp((SIZE - imageWidth) / 2 + position.x, imageWidth)
  const top = clamp((SIZE - imageHeight) / 2 + position.y, imageHeight)

  const crop = async () => {
    if (!file || !imageRef.current || !dimensions.width) return
    setError("")
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 400
      const context = canvas.getContext("2d")
      if (!context) throw new Error("Browser tidak mendukung crop gambar")
      context.drawImage(imageRef.current, -left / scale, -top / scale, SIZE / scale, SIZE / scale, 0, 0, 400, 400)
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Gagal memproses gambar")), "image/png"))
      await onCrop(new File([blob], "avatar.png", { type: "image/png" }))
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memotong gambar")
    }
  }

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => { if (!open && !busy) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atur crop avatar</DialogTitle>
          <DialogDescription>Geser gambar dan atur zoom hingga bagian yang diinginkan masuk dalam kotak 1:1.</DialogDescription>
        </DialogHeader>
        <div
          className="relative mx-auto aspect-square w-full max-w-[320px] touch-none overflow-hidden rounded-md bg-muted cursor-grab active:cursor-grabbing"
          onPointerDown={(event) => { dragRef.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y }; event.currentTarget.setPointerCapture(event.pointerId) }}
          onPointerMove={(event) => {
            if (!dragRef.current) return
            setPosition({ x: dragRef.current.startX + event.clientX - dragRef.current.x, y: dragRef.current.startY + event.clientY - dragRef.current.y })
          }}
          onPointerUp={() => { dragRef.current = null }}
          onPointerCancel={() => { dragRef.current = null }}
        >
          {url && <img ref={imageRef} src={url} alt="Pratinjau crop avatar" draggable={false} onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} className="absolute max-w-none select-none" style={{ width: imageWidth, height: imageHeight, left, top }} />}
          <div className="pointer-events-none absolute inset-0 border-2 border-white/80" />
        </div>
        <div className="space-y-2">
          <Label>Zoom</Label>
          <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={([value]) => setZoom(value)} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Batal</Button>
          <Button onClick={() => { void crop() }} disabled={busy || !dimensions.width}>{busy ? "Mengunggah..." : "Crop & Upload"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
