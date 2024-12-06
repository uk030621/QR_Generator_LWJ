"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setArticles(data.results || []);
        }
      } catch (err) {
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-800">Loading news...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">
        The Guardian News
      </h1>
      <div className="flex flex-col items-center mb-4">
        <Link href="/" className=" text-gray-700">
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-md rounded-lg overflow-hidden transition transform hover:scale-105"
          >
            {article.fields?.thumbnail && (
              <div className="relative w-full h-48">
                <Image
                  src={article.fields.thumbnail}
                  alt={article.webTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {article.webTitle}
              </h2>
              <p className="text-sm text-gray-600">
                {article.fields?.trailText}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {article.fields?.byline || "Unknown Author"}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
