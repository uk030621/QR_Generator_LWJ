import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.GUARDIAN_API_KEY; // Add your API key to .env
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const fromDate = searchParams.get("from-date") || ""; // ISO format date (e.g., "2023-12-06")
  const keyword = searchParams.get("q") || ""; // Search keyword
  const section = searchParams.get("section") || ""; // News section (e.g., "technology")
  const page = searchParams.get("page") || 1; // Page number (default 1)

  // Build API URL with optional parameters
  let apiUrl = `https://content.guardianapis.com/search?api-key=${apiKey}&show-fields=thumbnail,trailText,byline&page=${page}`;
  if (fromDate) apiUrl += `&from-date=${fromDate}`;
  if (keyword) apiUrl += `&q=${encodeURIComponent(keyword)}`;
  if (section) apiUrl += `&section=${section}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.response.status === "error") {
      return NextResponse.json(
        { error: "Failed to fetch news." },
        { status: 500 }
      );
    }

    return NextResponse.json(data.response);
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while fetching news." },
      { status: 500 }
    );
  }
}
