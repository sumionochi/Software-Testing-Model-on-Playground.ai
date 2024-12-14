import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, CopyCheckIcon } from 'lucide-react'

interface TaskOutputRendererProps {
  taskType: string
  output: Record<string, any>
}

// A small button to copy text to clipboard
function CopyToClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <CopyCheckIcon/> : <Copy/>}
    </Button>
  )
}

// Extract code from a string that may contain ``` blocks
function extractCodeBlock(str: string): { code: string, language: string | null } {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
  const match = codeBlockRegex.exec(str);
  if (match) {
    const language = match[1] || null;
    const code = match[2];
    return { code, language };
  }
  return { code: str.trim(), language: null };
}

export function TaskOutputRenderer({ taskType, output }: TaskOutputRendererProps) {

  // A helper to handle general code or JSON display
  const renderCodeOrJson = (content: string) => {
    // Try to parse JSON
    try {
      const json = JSON.parse(content);
      const prettyJson = JSON.stringify(json, null, 2);
      return (
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Task Output (JSON)</CardTitle>
            <CopyToClipboardButton text={prettyJson} />
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {prettyJson}
            </pre>
          </CardContent>
        </Card>
      );
    } catch {
      // Not valid JSON, try code block
      const { code, language } = extractCodeBlock(content);
      // If code block found
      return (
        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>Task Output {language ? `(${language})` : '(Code)'} </CardTitle>
            <CopyToClipboardButton text={code} />
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {code}
            </pre>
          </CardContent>
        </Card>
      );
    }
  };

  switch (taskType) {
    case 'Prompt':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Prompt Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{output.Response}</p>
          </CardContent>
        </Card>
      )
    case 'Writer':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Generated Text</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{output['Generated Text']}</p>
          </CardContent>
        </Card>
      )
    case 'Rewriter':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Rewritten Text</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{output['Rewritten Text']}</p>
          </CardContent>
        </Card>
      )
    case 'Summarization':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {output.Summary.split('\n').filter(Boolean).map((point: string, index: number) => (
                <li key={index}>{point.trim().replace(/^\*\s*/, '')}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )
    case 'Translation':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Translated Text</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{output['Translated Text']}</p>
          </CardContent>
        </Card>
      )
    case 'Language Detection':
      return (
        <Card>
          <CardHeader>
            <CardTitle>Detected Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {JSON.parse(output['Detected Languages'])
                .slice(0, 5)
                .map((lang: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{lang.detectedLanguage}</span>
                    <span className="font-mono">{(lang.confidence * 100).toFixed(2)}%</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )
    case 'Software Testing Model':
      // Handle the "Unit Test Code" output which may contain code blocks
      return renderCodeOrJson(output['Unit Test Code']);
    default:
      // Handle other output formats gracefully
      return renderCodeOrJson(JSON.stringify(output, null, 2));
  }
}
