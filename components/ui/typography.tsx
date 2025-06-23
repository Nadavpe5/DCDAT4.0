import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

// Headings with Intel One Display Medium
export function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-intel-medium tracking-tight lg:text-5xl text-intel-display", className)}>
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-intel-medium tracking-tight first:mt-0 text-intel-display", className)}>
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-intel-medium tracking-tight text-intel-display", className)}>
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-intel-medium tracking-tight text-intel-display", className)}>
      {children}
    </h4>
  )
}

// Body text with Intel One Display Regular
export function TypographyP({ children, className }: TypographyProps) {
  return (
    <p className={cn("leading-7 font-intel-regular text-intel-display [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  )
}

// Light text for subtle content
export function TypographyMuted({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-sm text-muted-foreground font-intel-light text-intel-display", className)}>
      {children}
    </p>
  )
}

// Large text for emphasis
export function TypographyLarge({ children, className }: TypographyProps) {
  return (
    <div className={cn("text-lg font-intel-medium text-intel-display", className)}>
      {children}
    </div>
  )
}

// Small text
export function TypographySmall({ children, className }: TypographyProps) {
  return (
    <small className={cn("text-sm font-intel-regular leading-none text-intel-display", className)}>
      {children}
    </small>
  )
}

// Lead text (larger paragraph)
export function TypographyLead({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-xl text-muted-foreground font-intel-light text-intel-display", className)}>
      {children}
    </p>
  )
}

// Code text (monospace fallback but with Intel styling)
export function TypographyCode({ children, className }: TypographyProps) {
  return (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-intel-regular text-sm text-intel-display", className)}>
      {children}
    </code>
  )
} 