import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-arduino";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import ErrorBoundary from "@/components/ErrorBoundary";

interface CodeViewProps {
  code: string;
  language?: string;
  title?: string;
}

function CodeView({ code, language = "text" }: CodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const maxLines = 20;

  // Clean HTML tags and entities from code
  const cleanCode = useMemo(() => {
    try {
      return code
        .replace(/<code>/g, "")
        .replace(/<\/code>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8230;/g, "…");
    } catch (error) {
      console.error("Error cleaning code:", error);
      setHasError(true);
      return code; // Return original code if cleaning fails
    }
  }, [code]);

  const shouldTruncate = cleanCode.split("\n").length > maxLines;
  const displayCode = isExpanded
    ? cleanCode
    : cleanCode.split("\n").slice(0, maxLines).join("\n");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Map language to Prism language
  const getPrismLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      c: "c",
      cpp: "cpp",
      arduino: "arduino", // Arduino has its own language support
      python: "python",
      javascript: "javascript",
      js: "javascript",
      typescript: "typescript",
      ts: "typescript",
      html: "markup", // HTML uses markup language
      css: "css",
      json: "json",
      bash: "bash",
      shell: "bash",
    };
    return langMap[lang.toLowerCase()] || "text";
  };

  // Highlight code using Prism
  const highlightCode = (code: string, lang: string) => {
    try {
      const prismLang = getPrismLanguage(lang);

      // Clean HTML entities and tags thoroughly
      let cleanCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&#8230;/g, "…")
        .replace(/<code[^>]*>/gi, "") // Remove opening code tags
        .replace(/<\/code>/gi, "") // Remove closing code tags
        .replace(/<pre[^>]*>/gi, "") // Remove pre tags
        .replace(/<\/pre>/gi, "") // Remove closing pre tags
        .trim();

      if (prismLang === "text") {
        return cleanCode;
      }

      try {
        return Prism.highlight(
          cleanCode,
          Prism.languages[prismLang],
          prismLang
        );
      } catch (error) {
        console.error("Prism highlighting error:", error);
        return cleanCode;
      }
    } catch (error) {
      console.error("Error in highlightCode:", error);
      setHasError(true);
      return code; // Return original code if highlighting fails
    }
  };

  // Apply highlighting when component mounts or code changes
  useEffect(() => {
    try {
      console.log("CodeView useEffect triggered:", {
        language,
        displayCodeLength: displayCode.length,
      });

      if (language !== "text") {
        console.log("Applying Prism highlighting for language:", language);
        Prism.highlightAll();
        console.log("Prism highlighting completed");
      }
    } catch (error) {
      console.error("Error applying Prism highlighting:", error);
      setHasError(true);
    }
  }, [displayCode, language]);

  // Debug logging
  useEffect(() => {
    console.log("CodeView render state:", {
      hasError,
      language,
      displayCodeLength: displayCode.length,
      shouldTruncate,
      isExpanded,
    });
  });

  // Show error fallback if something went wrong
  if (hasError) {
    return (
      <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Rendering Code
        </h3>
        <p className="text-red-600 mb-4">
          There was an error rendering the code. Showing raw code instead.
        </p>
        <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
          {code}
        </pre>
        <button
          onClick={() => setHasError(false)}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Fallback if Prism.js is not loaded
  if (typeof Prism === "undefined") {
    return (
      <div className="my-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Syntax Highlighting Unavailable
        </h3>
        <p className="text-yellow-600 mb-4">
          Syntax highlighting is not available. Showing plain text.
        </p>
        <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
          {code}
        </pre>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      console.log(
        "Attempting to copy code:",
        cleanCode.substring(0, 100) + "..."
      );

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cleanCode);
        console.log("Code copied successfully via clipboard API");
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = cleanCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          console.log("Code copied successfully via execCommand");
        } catch (err) {
          console.error("execCommand copy failed:", err);
          throw err;
        } finally {
          document.body.removeChild(textArea);
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
      // Show user-friendly error
      alert("Failed to copy code. Please try selecting and copying manually.");
    }
  };

  const prismLang = getPrismLanguage(language);

  return (
    <ErrorBoundary
      fallback={
        <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            CodeView Error
          </h3>
          <p className="text-red-600 mb-4">
            There was an error rendering the code. Showing raw code instead.
          </p>
          <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
            {code}
          </pre>
        </div>
      }
    >
      <div className="my-6 rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        {/* Code Content */}
        <div className="relative">
          {/* Copy Button - positioned inside codebox at top right */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-background/90 hover:bg-background shadow-sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy code"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Code Display with Prism.js Syntax Highlighting */}
          <div className="relative bg-background rounded-lg overflow-hidden">
            {/* Code content */}
            <pre
              className="text-sm leading-6 p-4 bg-background text-foreground overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground hover:scrollbar-thumb-foreground"
              style={{
                fontFamily:
                  'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }}
            >
              <code
                className={`language-${getPrismLanguage(language)}`}
                dangerouslySetInnerHTML={{
                  __html: highlightCode(displayCode, language),
                }}
              />
            </pre>
          </div>

          {/* Expand/Collapse Button */}
          {shouldTruncate && (
            <div className="flex justify-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default CodeView;
