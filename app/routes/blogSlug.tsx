import type { Route } from "./+types/blogSlug";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router";

import { ErrorBoundary } from "~/components/ErrorBoundary";
export { ErrorBoundary };

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  try {
    const baseUrl = import.meta.env.BASE_URL;
    const response = await fetch(`${baseUrl}posts/${slug}/index.md`);

    if (!response.ok) {
      throw new Response("Article not found", { status: 404 });
    }

    const content = await response.text();

    const [, frontmatter, markdown] =
      content.match(/^---\n(.*?)\n---\n(.*)/s) || [];

    let metadata: {
      title?: string;
      date?: string;
      author?: string;
    } = {};
    if (frontmatter) {
      metadata = Object.fromEntries(
        frontmatter.split("\n").map((line) => {
          const [key, value] = line.split(": ");
          return [key, value?.replace(/"/g, "")];
        })
      );
    }

    return { content: markdown || content, metadata, slug };
  } catch (error) {
    throw new Response("Article not found", { status: 404 });
  }
}

export default function Article({ loaderData }: Route.ComponentProps) {
  const { content, metadata } = loaderData;

  return (
    <main>
      <header>
        <Link to="/blog" data-btn-primary className="self-start">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour au blog
        </Link>
      </header>

      <article>
        {metadata.title && (
          <header>
            <h2>{metadata.title}</h2>
            {(metadata.date || metadata.author) && (
              <div className="flex items-center space-x-4 text-sm text-foreground border-b border-background-dark pb-4">
                {metadata.date && (
                  <time dateTime={metadata.date} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {new Date(metadata.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {metadata.author && (
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {metadata.author}
                  </span>
                )}
              </div>
            )}
          </header>
        )}

        <section className="pt-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              iframe: ({ node, ...props }) => (
                <iframe
                  {...props}
                  className="w-full aspect-video rounded-lg my-6"
                  allowFullScreen
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </section>

        <footer className="border-t border-background-dark pt-6 mt-8">
          <Link to="/blog" data-btn-primary className="self-start">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour aux articles
          </Link>
        </footer>
      </article>
    </main>
  );
}
