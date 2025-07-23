"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Check, Copy, ChevronDown, ChevronRight, Code2, Terminal, Play, AlertCircle } from "lucide-react"
// Types for code examples
export interface CodeExampleProps {
  title?: string
  description?: string
  examples: CodeExample[]
  installation?: InstallationInfo
  imports?: ImportStatement[]
  showLineNumbers?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  maxHeight?: string
  className?: string
}
export interface CodeExample {
  language: CodeLanguage
  code: string
  filename?: string
  framework?: Framework
  highlightLines?: number[]
  output?: string
  error?: string
}
export interface InstallationInfo {
  npm?: string
  yarn?: string
  pnpm?: string
  cdn?: string
}
export interface ImportStatement {
  language: CodeLanguage
  imports: string
}
export type CodeLanguage = "javascript" | "typescript" | "python" | "html" | "css" | "bash" | "json"
export type Framework = "react" | "vue" | "angular" | "vanilla" | "node"
// Language configs for basic syntax highlighting
const languageConfigs: Record<CodeLanguage, { keywords: string[], comment: string }> = {
  javascript: {
    keywords: ["const", "let", "var", "function", "class", "return", "if", "else", "for", "while", "import", "export", "from", "async", "await", "try", "catch", "throw", "new"],
    comment: "//"
  },
  typescript: {
    keywords: ["const", "let", "var", "function", "class", "return", "if", "else", "for", "while", "import", "export", "from", "async", "await", "try", "catch", "throw", "new", "interface", "type", "enum", "implements", "extends"],
    comment: "//"
  },
  python: {
    keywords: ["def", "class", "return", "if", "else", "elif", "for", "while", "import", "from", "as", "try", "except", "finally", "raise", "with", "async", "await", "lambda"],
    comment: "#"
  },
  html: {
    keywords: ["div", "span", "p", "a", "img", "button", "input", "form", "head", "body", "html", "script", "style", "link", "meta"],
    comment: "<!--"
  },
  css: {
    keywords: ["color", "background", "margin", "padding", "border", "display", "position", "width", "height", "font-size", "font-weight"],
    comment: "/*"
  },
  bash: {
    keywords: ["echo", "cd", "ls", "mkdir", "rm", "cp", "mv", "grep", "sed", "awk", "chmod", "npm", "yarn", "pnpm", "git"],
    comment: "#"
  },
  json: {
    keywords: [],
    comment: ""
  }
}
// Simple syntax highlighting function
function highlightCode(code: string, language: CodeLanguage): React.ReactNode {
  const config = languageConfigs[language]
  const lines = code.split('\n')
  return lines.map((line, lineIndex) => {
    let processedLine = line
    // Highlight keywords
    config.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g')
      processedLine = processedLine.replace(regex, '<span className="text-blue-600">$1</span>')
    })
    // Highlight strings
    processedLine = processedLine.replace(/(["'])([^"']*)\1/g, '<span className="text-green-600">$1$2$1</span>')
    // Highlight comments
    if (config.comment && processedLine.trim().startsWith(config.comment)) {
      processedLine = `<span className="text-gray-500">${processedLine}</span>`
    }
    // Highlight numbers
    processedLine = processedLine.replace(/\b(\d+)\b/g, '<span className="text-purple-600">$1</span>')
    return (
      <div key={lineIndex} dangerouslySetInnerHTML={{ __html: processedLine }} />
    )
  })
}
export function CodeExample({
  title,
  description,
  examples,
  installation,
  imports,
  showLineNumbers = true,
  collapsible = false,
  defaultExpanded = true,
  maxHeight = "500px",
  className
}: CodeExampleProps) {
  const [copiedStates, setCopiedStates] = React.useState<Record<string, boolean>>({})
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const [activeTab, setActiveTab] = React.useState(0)
  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedStates(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }))
      }, 2000)
    } catch (err) {
      }
  }
  const CodeBlock = ({ example, index }: { example: CodeExample; index: number }) => {
    const codeId = `code-${index}`
    const lines = example.code.split('\n')
    return (
      <div className="relative">
        {example.filename && (
          <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{example.filename}</span>
              {example.framework && (
                <Badge variant="outline" className="text-xs">
                  {example.framework}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(example.code, codeId)}
              className="h-8 px-2"
            >
              {copiedStates[codeId] ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="ml-1 text-xs">
                {copiedStates[codeId] ? "Copied" : "Copy"}
              </span>
            </Button>
          </div>
        )}
        <ScrollArea className="w-full" style={{ maxHeight }}>
          <div className="relative">
            <pre className="p-4 text-sm">
              <code className="grid">
                {lines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className={cn(
                      "grid grid-cols-[auto_1fr] gap-4",
                      example.highlightLines?.includes(lineIndex + 1) && "bg-yellow-100/50"
                    )}
                  >
                    {showLineNumbers && (
                      <span className="select-none text-right text-muted-foreground">
                        {lineIndex + 1}
                      </span>
                    )}
                    <div className="overflow-x-auto">
                      {highlightCode(line, example.language)}
                    </div>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </ScrollArea>
        {example.output && (
          <div className="border-t bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-800">
              <Play className="h-4 w-4" />
              Output:
            </div>
            <pre className="overflow-x-auto rounded bg-white p-3 text-sm">
              <code>{example.output}</code>
            </pre>
          </div>
        )}
        {example.error && (
          <Alert variant="destructive" className="m-4 mt-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-mono text-xs">
              {example.error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }
  const content = (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <div className="border-b p-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {installation && (
        <div className="border-b bg-muted/30 p-4">
          <h4 className="mb-3 text-sm font-semibold">Installation</h4>
          <div className="space-y-2">
            {installation.npm && (
              <div className="flex items-center justify-between rounded bg-background p-2">
                <code className="text-sm">npm install {installation.npm}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(`npm install ${installation.npm}`, 'install-npm')}
                  className="h-7 px-2"
                >
                  {copiedStates['install-npm'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
            {installation.yarn && (
              <div className="flex items-center justify-between rounded bg-background p-2">
                <code className="text-sm">yarn add {installation.yarn}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(`yarn add ${installation.yarn}`, 'install-yarn')}
                  className="h-7 px-2"
                >
                  {copiedStates['install-yarn'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
            {installation.pnpm && (
              <div className="flex items-center justify-between rounded bg-background p-2">
                <code className="text-sm">pnpm add {installation.pnpm}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(`pnpm add ${installation.pnpm}`, 'install-pnpm')}
                  className="h-7 px-2"
                >
                  {copiedStates['install-pnpm'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            )}
            {installation.cdn && (
              <div className="mt-3">
                <p className="mb-1 text-sm font-medium">Or via CDN:</p>
                <div className="flex items-center justify-between rounded bg-background p-2">
                  <code className="text-xs">{installation.cdn}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(installation.cdn!, 'install-cdn')}
                    className="h-7 px-2"
                  >
                    {copiedStates['install-cdn'] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {imports && imports.length > 0 && (
        <div className="border-b bg-muted/30 p-4">
          <h4 className="mb-3 text-sm font-semibold">Import Statements</h4>
          <div className="space-y-2">
            {imports.map((imp, index) => (
              <div key={index} className="flex items-center justify-between rounded bg-background p-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {imp.language}
                  </Badge>
                  <code className="text-sm">{imp.imports}</code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(imp.imports, `import-${index}`)}
                  className="h-7 px-2"
                >
                  {copiedStates[`import-${index}`] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {examples.length === 1 ? (
        <CodeBlock example={examples[0]} index={0} />
      ) : (
        <Tabs value={activeTab.toString()} onValueChange={(v) => setActiveTab(parseInt(v))}>
          <TabsList className="w-full justify-start rounded-none border-b bg-background p-0">
            {examples.map((example, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Code2 className="mr-2 h-4 w-4" />
                {example.language}
                {example.framework && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {example.framework}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {examples.map((example, index) => (
            <TabsContent key={index} value={index.toString()} className="m-0">
              <CodeBlock example={example} index={index} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Card>
  )
  if (collapsible) {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="mb-2 w-full justify-between p-2">
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              {title || "Code Example"}
            </span>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>{content}</CollapsibleContent>
      </Collapsible>
    )
  }
  return content
}