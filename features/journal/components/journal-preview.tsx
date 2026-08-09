"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface JournalPreviewProps {
  content: string;
  className?: string;
}

export function JournalPreview({ content, className }: JournalPreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground/60 select-none", className)}>
        <p className="text-sm">Nothing to preview yet.</p>
        <p className="text-xs">Start writing in Markdown to see live preview.</p>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-y-auto p-4 sm:p-6 space-y-4 text-foreground selection:bg-primary/20", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold tracking-tight font-heading text-foreground border-b border-border/50 pb-2 mb-4 mt-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold tracking-tight font-heading text-foreground mb-3 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold tracking-tight font-heading text-foreground mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="leading-relaxed text-sm sm:text-base text-foreground/90 mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 space-y-1 mb-3 text-sm sm:text-base text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 space-y-1 mb-3 text-sm sm:text-base text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/70 italic pl-4 py-1.5 my-3 text-muted-foreground bg-muted/20 rounded-r-md text-sm sm:text-base">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children }) => {
            const isBlock = Boolean(codeClassName);
            if (isBlock) {
              return (
                <pre className="bg-muted/80 p-3.5 rounded-lg overflow-x-auto my-3 text-xs font-mono border border-border/50 text-foreground">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border/40 text-foreground font-normal">
                {children}
              </code>
            );
          },
          hr: () => <hr className="border-border/60 my-5" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
