//app/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Separate state for debounced input
  const [section, setSection] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [page, setPage] = useState(1);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError("");

    const queryParams = new URLSearchParams({
      ...(searchTerm && { q: searchTerm }),
      ...(section && { section }),
      ...(fromDate && { "from-date": fromDate }),
      page,
    });

    try {
      const response = await fetch(`/api/news?${queryParams.toString()}`);
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
  }, [searchTerm, section, fromDate, page]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(keyword); // Update searchTerm after a delay
    }, 1000); // 300ms debounce delay

    return () => clearTimeout(delayDebounce); // Cleanup timeout on unmount or keyword change
  }, [keyword]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews();
  };

  const handleClearFilters = () => {
    setKeyword("");
    setSearchTerm("");
    setSection("");
    setFromDate("");
    setPage(1);
  };

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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        World News App
      </h1>
      <div className="flex flex-col text-center mb-4">
        <Link href="/">Back</Link>
      </div>
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by keyword"
            className="text-base w-full md:w-1/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="text-base w-full md:w-1/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sections</option>
            <option value="technology">Technology</option>
            <option value="sport">Sport</option>
            <option value="world">World</option>
            <option value="business">Business</option>
            <option value="culture">Culture</option>
          </select>
          {/*<input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-base w-full md:w-1/3 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />*/}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="text-sm px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Refresh
          </button>
          <button
            onClick={handleClearFilters}
            className="text-sm px-6 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 transition"
          >
            Clear Filters
          </button>
        </div>
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
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`text-sm px-4 py-2 bg-blue-600 text-white font-semibold rounded-md ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="text-sm px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </main>
  );
}
