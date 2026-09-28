"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
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
import {
  User,
  Globe,
  Search,
  Palette,
  Download,
  Upload,
  Save,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import { useCMSStore } from "@/lib/store"

export default function SettingsPage() {
  const siteWebsite = useCMSStore((state) => state.site.website)
  const setSiteWebsite = useCMSStore((state) => state.setSiteWebsite)
  const profile = useCMSStore((state) => state.profile)
  const setProfile = useCMSStore((state) => state.setProfile)

  const [profileData, setProfileData] = useState({
    name: profile.name,
    email: profile.email,
    bio: "I'm a passionate software engineer who loves building delightful and impactful web experiences. Let's create something amazing together!",
    location: "San Francisco, CA",
    website: siteWebsite,
    avatar: "/placeholder.svg?height=180&width=180",
  })

  const [siteConfig, setSiteConfig] = useState({
    siteTitle: "[Your Name] - Software Engineer",
    tagline: "Building delightful & impactful web experiences.",
    description: "Portfolio website showcasing my software engineering projects and experience",
    primaryColor: "#0891b2",
    theme: "light",
    language: "en",
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "John Doe - Full Stack Software Engineer",
    metaDescription:
      "Experienced software engineer specializing in React, Node.js, and cloud technologies. View my portfolio and get in touch.",
    keywords: "software engineer, full stack developer, react, nodejs, javascript, typescript",
    googleAnalytics: "GA-XXXXXXXXX-X",
    googleSearchConsole: "verified",
    sitemap: true,
    robots: true,
  })

  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com/your-github",
    linkedin: "https://linkedin.com/in/your-linkedin",
    twitter: "https://twitter.com/johndoe",
    email: "john.doe@example.com",
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <PageHeader title="Settings" description="Manage your profile and site configuration">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setSiteWebsite(profileData.website)
              setProfile({ name: profileData.name, email: profileData.email })
            }}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </PageHeader>

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
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Upload className="h-4 w-4" />
                      Upload New Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG or GIF. Max size 2MB. Recommended 400x400px.
                    </p>
                  </div>
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
                      <Label>Google Search Console</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm">
                          {seoSettings.googleSearchConsole === "verified" ? "Verified" : "Not Verified"}
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <ExternalLink className="h-4 w-4" />
                          Verify
                        </Button>
                      </div>
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
    </DashboardLayout>
  )
}
