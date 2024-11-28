'use client'

import { ArrowLeft, BriefcaseBusiness, Coffee, Home, Search } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  const [excuse, setExcuse] = useState("")
  const excuses = [
    "Our hamsters powering the servers needed a coffee break.",
    "The page went on vacation without telling us.",
    "Our code monkeys are currently debugging... their bananas.",
    "This page is playing hide and seek. It's winning.",
    "Error 404: Sense of direction not found.",
  ]

  useEffect(() => {
    setExcuse(excuses[Math.floor(Math.random() * excuses.length)])
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4 animate-bounce">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Oops! Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-6xl">
          {excuse}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/billing" passHref>
        <Button variant="outline" className="flex items-center justify-center">
          <Coffee className="w-4 h-4 mr-2" />
          Grab a Coffee
        </Button>
        </Link>
        <Link href="/" passHref>
          <Button variant="default" className="flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Back to Safety
          </Button>
        </Link>
        <Link href="/workflow" passHref>
        <Button variant="outline" className="flex items-center justify-center">
          <BriefcaseBusiness className="w-4 h-4 mr-2" />
          Go back to work
        </Button>
        </Link>
      </div>
      <div className="text-center animate-pulse">
        <p className="text-xl font-semibold mb-2">Lost? Try our patented "Un-404" dance:</p>
        <p className="text-muted-foreground">👉 👈 🙌 🕺 💃 🤷‍♂️</p>
      </div>
      <footer className="mt-6 text-center text-sm text-muted-foreground">
        If you believe this is a real error (and not just a cosmic joke),
        <br />please contact our support team. They could use a good laugh.
      </footer>
    </div>
  )
}