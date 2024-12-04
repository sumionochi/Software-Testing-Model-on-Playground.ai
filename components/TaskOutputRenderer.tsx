import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskOutputRendererProps {
  taskType: string
  output: Record<string, any>
}

export function TaskOutputRenderer({ taskType, output }: TaskOutputRendererProps) {
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
    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>Task Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(output, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )
  }
}