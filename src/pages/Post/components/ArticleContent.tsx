import React from "react";
import CodeView from "./CodeView";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Function to process content and add IDs to headings
  const processContent = (content: string) => {
    let processedContent = content;

    // Add IDs to h2 and h3 tags if they don't have them
    processedContent = processedContent.replace(
      /<h([23])([^>]*?)>(.*?)<\/h[23]>/g,
      (match, level, attributes, text) => {
        // Generate ID from text content
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim();

        // Check if ID already exists in attributes
        if (attributes.includes("id=")) {
          return match;
        }

        // Add ID attribute
        const newMatch = `<h${level}${attributes} id="${id}">${text}</h${level}>`;
        console.log(`Added ID to heading: "${text}" -> id="${id}"`);
        return newMatch;
      }
    );

    // Debug: Log the processed content to see if IDs were added
    console.log(
      "Processed content preview:",
      processedContent.substring(0, 500)
    );

    // Split content by code blocks
    const parts = processedContent.split(
      /(<pre[^>]*>.*?<\/pre>|<code[^>]*>.*?<\/code>)/s
    );

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("<pre") || part.startsWith("<code")) {
        // Extract code content
        const codeMatch = part.match(
          /(<pre[^>]*>.*?<\/pre>|<code[^>]*>.*?<\/code>)/s
        );
        if (codeMatch) {
          const codeContent = codeMatch[1] || codeMatch[2];
          // Clean HTML entities
          const cleanCode = codeContent
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#8211;/g, "–")
            .replace(/&#8212;/g, "—")
            .replace(/&#8230;/g, "…");

          // Try to detect language from class or determine from content
          let language = "text";
          const langMatch = part.match(/class="[^"]*language-(\w+)/);
          if (langMatch) {
            language = langMatch[1];
          } else if (
            cleanCode.includes("void setup()") ||
            cleanCode.includes("digitalWrite")
          ) {
            language = "arduino";
          } else if (
            cleanCode.includes("import") &&
            cleanCode.includes("def ")
          ) {
            language = "python";
          } else if (
            cleanCode.includes("function") &&
            cleanCode.includes("const ")
          ) {
            language = "javascript";
          } else if (
            cleanCode.includes("#include") &&
            cleanCode.includes("void ")
          ) {
            language = "cpp";
          }

          return <CodeView key={index} code={cleanCode} language={language} />;
        }
      }

      // Return regular HTML content with processed headings
      return (
        <div
          key={index}
          className="prose prose-lg max-w-none prose-headings:scroll-mt-24"
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return <div className="xl:col-span-2">{processContent(content)}</div>;
}
