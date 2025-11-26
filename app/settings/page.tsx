"use client"

import { Badge } from "@/components/ui/badge"

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
import {
  User,
  Globe,
  Search,
  Palette,
  Shield,
  Download,
  Upload,
  Save,
  Eye,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react"

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full-stack developer passionate about creating innovative web solutions. Experienced in React, Node.js, and cloud technologies.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    avatar: "/professional-headshot.png",
  })

  const [siteConfig, setSiteConfig] = useState({
    siteTitle: "John Doe - Software Engineer",
    tagline: "Building the future, one line of code at a time",
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
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    email: "john.doe@example.com",
  })

  const [contactForm, setContactForm] = useState({
    enabled: true,
    emailNotifications: true,
    autoReply: true,
    fields: ["name", "email", "subject", "message"],
  })

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: "weekly",
    lastBackup: "2024-03-20T10:30:00Z",
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your profile, site configuration, and integrations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="site">Site Config</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
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

                {/* Contact Form Settings */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Form
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Contact Form</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow visitors to contact you through your website
                        </p>
                      </div>
                      <Switch
                        checked={contactForm.enabled}
                        onCheckedChange={(checked) => setContactForm({ ...contactForm, enabled: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive email when someone submits the form</p>
                      </div>
                      <Switch
                        checked={contactForm.emailNotifications}
                        onCheckedChange={(checked) => setContactForm({ ...contactForm, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto Reply</Label>
                        <p className="text-sm text-muted-foreground">Send automatic confirmation to visitors</p>
                      </div>
                      <Switch
                        checked={contactForm.autoReply}
                        onCheckedChange={(checked) => setContactForm({ ...contactForm, autoReply: checked })}
                      />
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

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Third-party Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {/* Integration Cards */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                        <Github className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">GitHub</h3>
                        <p className="text-sm text-muted-foreground">Sync repositories and contributions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Connected</Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn</h3>
                        <p className="text-sm text-muted-foreground">Import professional experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Not Connected</Badge>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Google Analytics</h3>
                        <p className="text-sm text-muted-foreground">Track website performance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Connected</Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup & Export */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Backup & Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Backup Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup your data regularly</p>
                    </div>
                    <Switch
                      checked={backupSettings.autoBackup}
                      onCheckedChange={(checked) => setBackupSettings({ ...backupSettings, autoBackup: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select
                      value={backupSettings.backupFrequency}
                      onValueChange={(value) => setBackupSettings({ ...backupSettings, backupFrequency: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last Backup</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(backupSettings.lastBackup).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Manual Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Manual Actions</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button variant="outline" className="gap-2 h-auto p-4 flex-col items-start bg-transparent">
                      <div className="flex items-center gap-2 w-full">
                        <Download className="h-4 w-4" />
                        <span className="font-medium">Export All Data</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Download complete backup of all your content
                      </p>
                    </Button>

                    <Button variant="outline" className="gap-2 h-auto p-4 flex-col items-start bg-transparent">
                      <div className="flex items-center gap-2 w-full">
                        <Upload className="h-4 w-4" />
                        <span className="font-medium">Import Data</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">Restore from a previous backup file</p>
                    </Button>

                    <Button variant="outline" className="gap-2 h-auto p-4 flex-col items-start bg-transparent">
                      <div className="flex items-center gap-2 w-full">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Preview Site</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        View how your portfolio looks to visitors
                      </p>
                    </Button>

                    <Button variant="outline" className="gap-2 h-auto p-4 flex-col items-start bg-transparent">
                      <div className="flex items-center gap-2 w-full">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">Publish Changes</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Deploy your latest changes to production
                      </p>
                    </Button>
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
