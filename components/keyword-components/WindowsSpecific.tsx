"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertCircle, 
  Terminal, 
  MousePointer, 
  Shield, 
  ChevronRight,
  Copy,
  CheckCircle2,
  FileText,
  Monitor,
  Command
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface WindowsSpecificProps {
  /** The main title for the Windows guide */
  title?: string
  /** Brief description of what the guide covers */
  description?: string
  /** Default Windows version to show */
  defaultVersion?: "windows-11" | "windows-10" | "windows-8" | "windows-7"
  /** Whether to show the admin privileges warning */
  showAdminWarning?: boolean
  /** Custom className for the component */
  className?: string
  /** Children elements to render inside the component */
  children?: React.ReactNode
}

export interface CommandBlockProps {
  command: string
  type?: "powershell" | "cmd" | "terminal"
  description?: string
}

export interface StepProps {
  number: number
  title: string
  description: string
  screenshot?: {
    src: string
    alt: string
  }
  note?: string
  adminRequired?: boolean
}

export interface FilePathProps {
  path: string
  type?: "file" | "folder"
}

export interface KeyboardShortcutProps {
  keys: string[]
  description?: string
}

// Command Block Component
function CommandBlock({ command, type = "powershell", description }: CommandBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getIcon = () => {
    switch (type) {
      case "powershell":
        return <Terminal className="h-4 w-4" />
      case "cmd":
        return <Monitor className="h-4 w-4" />
      case "terminal":
        return <Command className="h-4 w-4" />
      default:
        return <Terminal className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (type) {
      case "powershell":
        return "PowerShell"
      case "cmd":
        return "Command Prompt"
      case "terminal":
        return "Windows Terminal"
      default:
        return "PowerShell"
    }
  }

  return (
    <div className="my-4">
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      <div className="relative group">
        <div className="absolute top-2 left-2 flex items-center gap-2">
          {getIcon()}
          <span className="text-xs font-medium text-muted-foreground">{getLabel()}</span>
        </div>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 pt-10 overflow-x-auto">
          <code className="text-sm font-mono">{command}</code>
        </pre>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

// Step Component
function Step({ number, title, description, screenshot, note, adminRequired }: StepProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            {title}
            {adminRequired && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin Required
              </Badge>
            )}
          </h4>
          <p className="text-muted-foreground mb-4">{description}</p>
          
          {screenshot && (
            <div className="mb-4 border rounded-lg overflow-hidden bg-muted/20">
              <img
                src={screenshot.src}
                alt={screenshot.alt}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}
          
          {note && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{note}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

// File Path Component
function FilePath({ path, type = "file" }: FilePathProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(path)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm font-mono group">
      <FileText className="h-3 w-3 text-muted-foreground" />
      <span>{path}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckCircle2 className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}

// Keyboard Shortcut Component
function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-muted-foreground">+</span>}
          </React.Fragment>
        ))}
      </div>
      {description && <span className="text-sm text-muted-foreground">{description}</span>}
    </div>
  )
}

// Main Component
export function WindowsSpecific({
  title = "Windows-Specific Guide",
  description,
  defaultVersion = "windows-11",
  showAdminWarning = true,
  className,
  children
}: WindowsSpecificProps) {
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion)

  const windowsVersions = [
    { value: "windows-11", label: "Windows 11" },
    { value: "windows-10", label: "Windows 10" },
    { value: "windows-8", label: "Windows 8/8.1" },
    { value: "windows-7", label: "Windows 7" }
  ]

  return (
    <Card className={cn("w-full", className)} itemScope itemType="https://schema.org/HowTo">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle itemProp="name">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground mt-2" itemProp="description">{description}</p>
            )}
          </div>
          <Select value={selectedVersion} onValueChange={(value) => setSelectedVersion(value as typeof selectedVersion)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {windowsVersions.map(version => (
                <SelectItem key={version.value} value={version.value}>
                  {version.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {showAdminWarning && (
          <Alert className="mb-6" variant="default">
            <Shield className="h-4 w-4" />
            <AlertTitle>Administrator Privileges</AlertTitle>
            <AlertDescription>
              Some steps in this guide may require administrator privileges. Right-click on PowerShell or Command Prompt and select "Run as administrator" when needed.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gui" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gui">GUI Method</TabsTrigger>
            <TabsTrigger value="powershell">PowerShell</TabsTrigger>
            <TabsTrigger value="cmd">Command Prompt</TabsTrigger>
          </TabsList>

          <TabsContent value="gui" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Using Windows GUI</h3>
              
              {/* Example steps - these would be customized per use case */}
              <div itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                <Step
                  number={1}
                  title="Open File Explorer"
                  description="Press Windows + E or click the File Explorer icon in the taskbar"
                  screenshot={{
                    src: "/screenshots/windows-file-explorer.png",
                    alt: "Windows File Explorer opening"
                  }}
                />
              </div>

              <div itemProp="step" itemScope itemType="https://schema.org/HowToStep">
                <Step
                  number={2}
                  title="Navigate to your file"
                  description="Browse to the location where your SVG or PNG file is stored"
                  note="You can also use the search bar to find your file quickly"
                />
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-semibold">Useful Keyboard Shortcuts</h4>
                <div className="grid gap-3">
                  <KeyboardShortcut keys={["Win", "E"]} description="Open File Explorer" />
                  <KeyboardShortcut keys={["Ctrl", "C"]} description="Copy selected file" />
                  <KeyboardShortcut keys={["Ctrl", "V"]} description="Paste file" />
                  <KeyboardShortcut keys={["F2"]} description="Rename selected file" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="powershell" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Using PowerShell</h3>
              
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertDescription>
                  PowerShell is the recommended command-line tool for Windows. It provides more features and better compatibility with modern Windows systems.
                </AlertDescription>
              </Alert>

              <CommandBlock
                command={`# Convert PNG to SVG using PowerShell
$inputFile = "C:\\Users\\YourName\\Pictures\\image.png"
$outputFile = "C:\\Users\\YourName\\Pictures\\image.svg"

# Using a conversion tool
convert-image -InputPath $inputFile -OutputPath $outputFile -Format SVG`}
                type="powershell"
                description="Example PowerShell command for image conversion"
              />

              <div className="space-y-4">
                <h4 className="font-semibold">Common File Paths</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Desktop:</span>
                    <FilePath path="C:\\Users\\%USERNAME%\\Desktop" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Documents:</span>
                    <FilePath path="C:\\Users\\%USERNAME%\\Documents" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Downloads:</span>
                    <FilePath path="C:\\Users\\%USERNAME%\\Downloads" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cmd" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Using Command Prompt</h3>
              
              <CommandBlock
                command="REM Navigate to your directory\ncd C:\\Users\\YourName\\Pictures\n\nREM List files in directory\ndir *.png\n\nREM Use conversion tool\nconvert image.png image.svg"
                type="cmd"
                description="Example Command Prompt commands for file conversion"
              />

              <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Command Prompt is the legacy Windows command-line interface. For newer features and better scripting support, consider using PowerShell instead.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Alternative Methods</h3>
          
          <div className="grid gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Using Windows Context Menu
              </h4>
              <p className="text-sm text-muted-foreground">
                Right-click on your file and look for conversion options in the context menu. Some applications add their own menu items here.
              </p>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Using Windows Paint
              </h4>
              <p className="text-sm text-muted-foreground">
                Open your image in Paint, then use "Save as" to convert between different formats (limited SVG support).
              </p>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Common Windows-Specific Issues</h3>
          
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">File associations not working</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  SVG files may not open correctly if no default program is set.
                </p>
                <CommandBlock
                  command={`assoc .svg=svgfile
ftype svgfile="C:\\Program Files\\YourSVGViewer\\viewer.exe" "%1"`}
                  type="cmd"
                  description="Set file association for SVG files"
                />
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-1">Permission denied errors</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You may need to run commands as administrator or take ownership of files.
                </p>
                <CommandBlock
                  command={`takeown /f "C:\\path\\to\\file.svg" /r
icacls "C:\\path\\to\\file.svg" /grant %username%:F`}
                  type="cmd"
                  description="Take ownership and grant permissions"
                />
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-1">Path length limitations</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Windows has a 260 character path limit by default. Enable long paths in Windows 10/11.
                </p>
                <CommandBlock
                  command={`New-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force`}
                  type="powershell"
                  description="Enable long path support (requires admin)"
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Registry Warning */}
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Registry Edit Warning</AlertTitle>
          <AlertDescription>
            Some advanced fixes may require editing the Windows Registry. Always back up your registry before making changes. Incorrect modifications can cause system instability.
          </AlertDescription>
        </Alert>

        {/* Fallback for other OS */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            Not using Windows? Check out our guides for{" "}
            <a href="/guides/mac-specific" className="underline">macOS</a>,{" "}
            <a href="/guides/linux-specific" className="underline">Linux</a>, or{" "}
            <a href="/guides/cross-platform" className="underline">cross-platform solutions</a>.
          </p>
        </div>

        {/* Custom content */}
        {children}
      </CardContent>
    </Card>
  )
}

// Export sub-components for flexibility
export { CommandBlock, Step, FilePath, KeyboardShortcut }