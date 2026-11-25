// client/src/components/MarkdownRenderer.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group my-3 rounded-lg overflow-hidden">
      {/* Language label and copy button */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-gray-300 text-sm">
        <span>{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon />
              <span>Copied</span>
            </>
          ) : (
            <>
              <CopyIcon />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax-highlighted code */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          padding: '16px',
        }}
        showLineNumbers={code.split('\n').length > 3}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Custom code block rendering
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return <CodeBlock language={match[1]} code={code} />;
          }

          if (!inline && code.includes('\n')) {
            return <CodeBlock language="" code={code} />;
          }

          // Inline code
          return (
            <code
              className="bg-gray-200 text-red-700 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },

        // Style other markdown elements
        p({ children }) {
          return <p className="mb-3 leading-7">{children}</p>;
        },
        h1({ children }) {
          return (
            <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>
          );
        },
        h2({ children }) {
          return (
            <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="text-lg font-semibold mb-2 mt-3">{children}</h3>
          );
        },
        ul({ children }) {
          return (
            <ul className="list-disc list-inside mb-3 space-y-1">
              {children}
            </ul>
          );
        },
        ol({ children }) {
          return (
            <ol className="list-decimal list-inside mb-3 space-y-1">
              {children}
            </ol>
          );
        },
        li({ children }) {
          return <li className="leading-7">{children}</li>;
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-4 my-3 text-gray-600 italic">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
                {children}
              </table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="px-4 py-2 bg-gray-100 text-left text-sm font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="px-4 py-2 border-t border-gray-200 text-sm">
              {children}
            </td>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}