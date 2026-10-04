import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * MathText Component:
 * Automatically renders inline ($...$) and block ($$...$$) LaTeX equations
 * using KaTeX, with line-break preservation and graceful fallback.
 */
export default function MathText({ text = '', className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    // Fast path: if no math delimiters, render regular text with line breaks
    if (!text.includes('$')) {
      const lines = text.split('\n');
      return lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ));
    }

    // Split text into normal text vs math chunks
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Block math: $$ ... $$
      if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
        const formula = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false
          });
          return (
            <span
              key={index}
              className="my-2 block overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="font-mono text-amber-500">{part}</span>;
        }
      }

      // Inline math: $ ... $
      if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        const formula = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false
          });
          return (
            <span
              key={index}
              className="inline-block px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <span key={index} className="font-mono text-amber-500">{part}</span>;
        }
      }

      // Normal text: preserve newlines
      const lines = part.split('\n');
      return lines.map((line, lIdx) => (
        <React.Fragment key={`${index}-${lIdx}`}>
          {line}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      ));
    });
  }, [text]);

  return <span className={`inline-block leading-relaxed ${className}`}>{renderedContent}</span>;
}
