import { Link } from "react-router";
import type { Route } from "./+types/blogIndex";

import { ErrorBoundary } from "~/components/ErrorBoundary";
export { ErrorBoundary };

interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt?: string;
}

export async function clientLoader() {
  const baseUrl = import.meta.env.BASE_URL;

  try {
    const response = await fetch(`${baseUrl}posts/index.json`);

    if (!response.ok) {
      throw new Response("Impossible de charger les articles", {
        status: response.status,
        statusText: "Erreur lors du chargement des articles",
      });
    }

    const articles = await response.json();

    if (!Array.isArray(articles)) {
      throw new Response("Format des données invalide", {
        status: 500,
        statusText: "Les données des articles sont dans un format invalide",
      });
    }

    return { articles } as { articles: Article[] };
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    console.error("Erreur lors du chargement des articles:", error);
    throw new Response("Erreur de connexion", {
      status: 500,
      statusText: "Impossible de se connecter au serveur",
    });
  }
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <main>
      <header>
        <h2>Blog</h2>
        <p className="text-foreground">
          Découvrez nos derniers articles et tutoriels
        </p>
      </header>

      {articles.length === 0 ? (
        <section className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2 text-foreground-dark">
            Aucun article pour le moment
          </h3>
          <p className="text-foreground">
            Nous travaillons sur du contenu intéressant. Revenez bientôt !
          </p>
        </section>
      ) : (
        <section>
          {articles.map((article: Article) => (
            <article key={article.slug}>
              <header>
                <h3>
                  <Link
                    to={article.slug}
                    data-link
                    className="transition-colors"
                  >
                    {article.title}
                  </Link>
                </h3>

                <div className="flex items-center space-x-4 text-sm text-foreground">
                  {article.date && (
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {article.author && <span>Par {article.author}</span>}
                </div>
              </header>

              {article.excerpt && (
                <p className="text-foreground-dark">{article.excerpt}</p>
              )}

              <Link to={article.slug} data-btn-primary className="self-start">
                Lire la suite
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
