"use client"

import { useEffect, useRef, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContentSkeleton } from "@/components/dashboard-content-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/common/page-header"
import { AvatarCropDialog } from "@/components/settings/avatar-crop-dialog"
import {
  User,
  Globe,
  Search,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useCMSStore } from "@/lib/store"
import { apiAssetUrl, apiDeleteUpload, apiUpload } from "@/lib/api-client"

export default function SettingsPage() {
  const settings = useCMSStore((state) => state.settings)
  const updateSettings = useCMSStore((state) => state.updateSettings)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const draftUploads = useRef(new Set<string>())
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [draftReady, setDraftReady] = useState(false)

  const [profileData, setProfileData] = useState({
    name: "", email: "", bio: "", location: "", website: "", avatar: "", cv: null as { url: string; name: string; size: number } | null,
  })

  const [siteConfig, setSiteConfig] = useState({
    siteTitle: "", tagline: "", description: "", primaryColor: "", theme: "light", language: "en",
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "", metaDescription: "", keywords: "", googleAnalytics: "", googleSearchConsole: "", sitemap: false, robots: false,
  })

  const [socialLinks, setSocialLinks] = useState({
    github: "", linkedin: "", twitter: "", email: "",
  })

  useEffect(() => {
    if (!settings) return
    setProfileData({ name: settings.profile?.name ?? "", email: settings.profile?.email ?? "", bio: settings.profile?.bio ?? "", location: settings.profile?.location ?? "", website: settings.profile?.website ?? "", avatar: settings.profile?.avatar ?? "", cv: settings.profile?.cv ?? null })
    setSiteConfig({ siteTitle: settings.siteConfig?.siteTitle ?? "", tagline: settings.siteConfig?.tagline ?? "", description: settings.siteConfig?.description ?? "", primaryColor: settings.siteConfig?.primaryColor ?? "", theme: settings.siteConfig?.theme ?? "light", language: settings.siteConfig?.language ?? "en" })
    setSeoSettings({ metaTitle: settings.seo?.metaTitle ?? "", metaDescription: settings.seo?.metaDescription ?? "", keywords: Array.isArray(settings.seo?.keywords) ? settings.seo.keywords.join(", ") : settings.seo?.keywords ?? "", googleAnalytics: settings.seo?.googleAnalytics ?? "", googleSearchConsole: settings.seo?.googleSearchConsole ?? "", sitemap: String(settings.seo?.sitemap) === "true", robots: String(settings.seo?.robots) === "true" })
    setSocialLinks({ github: settings.socialLinks?.github ?? "", linkedin: settings.socialLinks?.linkedin ?? "", twitter: settings.socialLinks?.twitter ?? "", email: settings.socialLinks?.email ?? "" })
    setDraftReady(true)
  }, [settings])

  useEffect(() => () => {
    for (const url of draftUploads.current) void apiDeleteUpload(url).catch(() => {})
  }, [])

  const discardDrafts = async (keep: string[] = []) => {
    for (const url of draftUploads.current) {
      if (keep.includes(url)) continue
      await apiDeleteUpload(url)
      draftUploads.current.delete(url)
    }
  }

  const saveChanges = async () => {
    setSaving(true)
    setError("")
    setMessage("")
    try {
      await updateSettings({ profile: profileData, siteConfig, seo: seoSettings, socialLinks })
      draftUploads.current.delete(profileData.avatar)
      if (profileData.cv) draftUploads.current.delete(profileData.cv.url)
      await discardDrafts()
      setMessage("Perubahan tersimpan di porto-service")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal menyimpan pengaturan")
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (file?: File) => {
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const uploaded = await apiUpload(file)
      draftUploads.current.add(uploaded.url)
      await discardDrafts([uploaded.url, profileData.cv?.url ?? ""])
      setProfileData((current) => ({ ...current, avatar: uploaded.url }))
      setMessage("Foto terunggah. Klik Save Changes untuk menyimpan profil.")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengunggah foto")
      throw cause
    } finally {
      setUploading(false)
    }
  }

  const chooseAvatar = async (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    try {
      const image = new Image()
      image.src = url
      await image.decode()
      if (!image.naturalWidth || !image.naturalHeight) throw new Error("Gambar tidak valid")
      if (image.naturalWidth !== image.naturalHeight) setCropFile(file)
      else await uploadAvatar(file)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal membaca gambar")
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const removeAvatar = async () => {
    setError("")
    if (draftUploads.current.has(profileData.avatar)) {
      setUploading(true)
      try {
        await apiDeleteUpload(profileData.avatar)
        draftUploads.current.delete(profileData.avatar)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Gagal menghapus foto")
        setUploading(false)
        return
      }
      setUploading(false)
    }
    setProfileData((current) => ({ ...current, avatar: "" }))
    setMessage("Klik Save Changes untuk menghapus foto dari profil.")
  }

  const uploadCv = async (file?: File) => {
    if (!file) return
    setError("")
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("CV harus berupa file PDF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran CV maksimal 10 MB")
      return
    }
    setUploading(true)
    try {
      const uploaded = await apiUpload(file)
      draftUploads.current.add(uploaded.url)
      await discardDrafts([uploaded.url, profileData.avatar])
      setProfileData((current) => ({ ...current, cv: { url: uploaded.url, name: uploaded.name, size: uploaded.size } }))
      setMessage("CV terunggah. Klik Save Changes untuk menyimpannya.")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengunggah CV")
    } finally {
      setUploading(false)
    }
  }

  const removeCv = async () => {
    const url = profileData.cv?.url
    if (!url) return
    setError("")
    if (draftUploads.current.has(url)) {
      setUploading(true)
      try {
        await apiDeleteUpload(url)
        draftUploads.current.delete(url)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Gagal menghapus CV")
        setUploading(false)
        return
      }
      setUploading(false)
    }
    setProfileData((current) => ({ ...current, cv: null }))
    setMessage("Klik Save Changes untuk menghapus CV dari profil.")
  }

  const exportData = () => {
    const { projects, blogPosts, workExperience, education, skills, achievements, settings } = useCMSStore.getState()
    const url = URL.createObjectURL(new Blob([JSON.stringify({ projects, blogPosts, workExperience, education, skills, achievements, settings }, null, 2)], { type: "application/json" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "portfolio-cms-export.json"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (!draftReady) {
    return <DashboardLayout><DashboardContentSkeleton pathname="/settings" /></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader title="Settings" description="Manage your profile and site configuration">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={exportData}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="gap-2" onClick={saveChanges} disabled={saving || uploading}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </PageHeader>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {message && <p role="status" className="text-sm text-primary">{message}</p>}

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="site">Site Config</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={apiAssetUrl(profileData.avatar) || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="gap-2 bg-transparent">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                      Upload New Photo
                      </label>
                    </Button>
                    <input id="avatar-upload" type="file" accept="image/*" className="hidden" disabled={uploading || saving} onChange={(event) => { void chooseAvatar(event.target.files?.[0]); event.target.value = "" }} />
                    {profileData.avatar && (
                      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => { void removeAvatar() }} disabled={saving || uploading}>
                        <Trash2 className="h-4 w-4" />
                        Remove Photo
                      </Button>
                    )}
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB. Recommended 400x400px.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="cv-upload">Curriculum Vitae (PDF)</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline" className="gap-2 bg-transparent">
                      <label htmlFor="cv-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {profileData.cv ? "Replace CV" : "Upload CV"}
                      </label>
                    </Button>
                    <input id="cv-upload" type="file" accept="application/pdf,.pdf" className="hidden" disabled={uploading || saving} onChange={(event) => { void uploadCv(event.target.files?.[0]); event.target.value = "" }} />
                    {profileData.cv && (
                      <>
                        <a href={apiAssetUrl(profileData.cv.url)} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">{profileData.cv.name}</a>
                        <span className="text-sm text-muted-foreground">{(profileData.cv.size / 1024 / 1024).toFixed(2)} MB</span>
                        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => { void removeCv() }} disabled={saving || uploading}>
                          <Trash2 className="h-4 w-4" /> Remove CV
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">PDF, maksimal 10 MB. Setelah disimpan, CV tersedia untuk diunduh dari porto.</p>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell visitors about yourself..."
                  />
                  <p className="text-sm text-muted-foreground">{profileData.bio.length}/500 characters</p>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Label>
                      <Input
                        id="github"
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Label>
                      <Input
                        id="twitter"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact Email
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={socialLinks.email}
                        onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Configuration */}
          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input
                      id="site-title"
                      value={siteConfig.siteTitle}
                      onChange={(e) => setSiteConfig({ ...siteConfig, siteTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteConfig.tagline}
                      onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Site Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={siteConfig.description}
                    onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                  />
                </div>

                <Separator />

                {/* Theme Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme & Appearance
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={siteConfig.primaryColor}
                          onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={siteConfig.primaryColor}
                          onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={siteConfig.theme}
                        onValueChange={(value) => setSiteConfig({ ...siteConfig, theme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={siteConfig.language}
                        onValueChange={(value) => setSiteConfig({ ...siteConfig, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  SEO Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      value={seoSettings.metaTitle}
                      onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      {seoSettings.metaTitle.length}/60 characters (recommended)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      rows={3}
                      value={seoSettings.metaDescription}
                      onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground">
                      {seoSettings.metaDescription.length}/160 characters (recommended)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={seoSettings.keywords}
                      onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-sm text-muted-foreground">Separate keywords with commas</p>
                  </div>
                </div>

                <Separator />

                {/* Analytics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Analytics & Tracking</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="google-analytics">Google Analytics ID</Label>
                      <Input
                        id="google-analytics"
                        value={seoSettings.googleAnalytics}
                        onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalytics: e.target.value })}
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="search-console">Google Search Console</Label>
                      <Input
                        id="search-console"
                        value={seoSettings.googleSearchConsole}
                        onChange={(event) => setSeoSettings({ ...seoSettings, googleSearchConsole: event.target.value })}
                        placeholder="Verification token"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* SEO Tools */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SEO Tools</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Generate Sitemap</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically generate XML sitemap for search engines
                        </p>
                      </div>
                      <Switch
                        checked={seoSettings.sitemap}
                        onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, sitemap: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Robots.txt</Label>
                        <p className="text-sm text-muted-foreground">
                          Generate robots.txt file for search engine crawlers
                        </p>
                      </div>
                      <Switch
                        checked={seoSettings.robots}
                        onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, robots: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AvatarCropDialog file={cropFile} busy={uploading} onClose={() => setCropFile(null)} onCrop={uploadAvatar} />
    </DashboardLayout>
  )
}
