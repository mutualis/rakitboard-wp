import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [clickedId, setClickedId] = useState<string>("");

  // Extract headings from content
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Wait longer for DOM to be fully rendered and content to be processed
      const timer = setTimeout(() => {
        // Only select headings from the article content area, not from sidebar or other elements
        const contentArea = document.querySelector(".prose");

        if (contentArea) {
          const headingElements = contentArea.querySelectorAll("h2, h3");
          console.log(
            "Found headings in content area:",
            headingElements.length
          );

          if (headingElements.length === 0) {
            console.warn(
              "No headings found in content area, trying again in 500ms..."
            );
            // Try again if no headings found
            setTimeout(() => {
              const retryElements = contentArea.querySelectorAll("h2, h3");
              console.log(
                "Retry found headings in content area:",
                retryElements.length
              );
              if (retryElements.length > 0) {
                processHeadings(retryElements);
              }
            }, 500);
            return;
          }

          processHeadings(headingElements);
        } else {
          console.warn(
            "Content area not found, trying document-wide search..."
          );
          // Fallback to document-wide search if content area not found
          const headingElements = document.querySelectorAll("h2, h3");
          console.log("Found headings in document:", headingElements.length);
          if (headingElements.length > 0) {
            processHeadings(headingElements);
          }
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [content]);

  // Helper function to process headings
  const processHeadings = (headingElements: NodeListOf<Element>) => {
    const tocItems: TocItem[] = Array.from(headingElements)
      .filter((element) => {
        // Filter out headings that are not from article content
        const text = element.textContent || "";
        const isArticleHeading =
          !text.includes("Bagikan artikel ini:") &&
          !text.includes("Komentar") &&
          !text.includes("Ingin belajar lebih lanjut?") &&
          !text.includes("RakitBoard") &&
          !text.includes("Wrapping Up") &&
          !text.includes("On this page") &&
          text.trim().length > 0;

        return isArticleHeading;
      })
      .map((element) => {
        const id = element.id || "";
        const text = element.textContent || "";
        const level = parseInt(element.tagName.charAt(1));

        console.log(`Heading: "${text}" -> id="${id}", level=${level}`);

        return { id, text, level };
      });

    setHeadings(tocItems);
  };

  // Scroll tracking for active heading using Intersection Observer
  useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;

    console.log(
      "Setting up Intersection Observer for",
      headings.length,
      "headings"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Heading visible:", entry.target.id);
            // Only update activeId if not currently scrolling to a clicked item
            if (!clickedId || clickedId === entry.target.id) {
              setActiveId(entry.target.id);
              // Update URL hash without triggering scroll
              if (window.location.hash !== `#${entry.target.id}`) {
                window.history.replaceState(null, "", `#${entry.target.id}`);
              }
            }
          }
        });
      },
      {
        rootMargin: "-10% 0px -80% 0px", // More sensitive detection
        threshold: 0.01, // Very low threshold for immediate detection
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        console.log("Observing heading:", heading.id);
        observer.observe(element);
      } else {
        console.warn("Heading element not found:", heading.id);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings, clickedId]);

  // Set initial active ID from URL hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (headings.some((h) => h.id === hash)) {
        setActiveId(hash);
      }
    }
  }, [headings]);

  // Fallback scroll tracking if Intersection Observer fails
  useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      // Find the heading that's currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const element = document.getElementById(heading.id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            // Only update activeId if not currently scrolling to a clicked item
            if (
              activeId !== heading.id &&
              (!clickedId || clickedId === heading.id)
            ) {
              console.log("Scroll fallback: Active heading:", heading.id);
              setActiveId(heading.id);
            }
            break;
          }
        }
      }
    };

    // Add scroll listener as fallback
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings, activeId, clickedId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set clickedId to prevent other sections from becoming active during scroll
      setClickedId(id);
      setActiveId(id);

      // Use smooth scroll behavior
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL hash
      window.history.pushState(null, "", `#${id}`);

      // Reset clickedId after scroll animation completes (typically 500-1000ms)
      setTimeout(() => {
        setClickedId("");
      }, 1500);
    }
  };

  return (
    <div className="sticky top-0 max-h-[100svh] overflow-x-hidden px-6 pt-10 pb-24">
      <div className="flex flex-col gap-3">
        <h3 className="font-sans text-sm font-medium tracking-wide text-muted-foreground uppercase">
          On this page
        </h3>

        <ul className="flex flex-col border-l border-border">
          {headings.map((heading) => (
            <li key={heading.id} className=" flex flex-col items-start">
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "min-h-7 w-full text-left border-l-2 border-muted/30 font-sans text-sm text-muted-foreground transition-colors duration-150 hover:border-foreground/60 hover:text-foreground aria-[current]:border-foreground aria-[current]:font-semibold aria-[current]:text-foreground cursor-pointer",
                  heading.level === 2 && "pl-5 sm:pl-4",
                  heading.level === 3 && "pl-8 sm:pl-7.5",
                  activeId === heading.id &&
                    "border-foreground font-semibold text-foreground"
                )}
                aria-current={activeId === heading.id ? "location" : undefined}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
