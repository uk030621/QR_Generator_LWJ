import { NextResponse } from "next/server";

export async function GET(request) {
  const apiKey = process.env.GUARDIAN_API_KEY; // API key from .env
  const { searchParams } = new URL(request.url);

  // Extract query parameters
  const fromDate = searchParams.get("from-date") || ""; // ISO format date
  const keyword = searchParams.get("q") || ""; // Search keyword
  const section = searchParams.get("section") || ""; // News section
  const page = searchParams.get("page") || 1; // Page number (default 1)

  // Build API URL with optional parameters
  let apiUrl = `https://content.guardianapis.com/search?api-key=${apiKey}&show-fields=thumbnail,trailText,byline&page=${page}`;
  if (fromDate) apiUrl += `&from-date=${fromDate}`;
  if (keyword) apiUrl += `&q=${encodeURIComponent(keyword)}`;
  if (section) apiUrl += `&section=${section}`;

  try {
    //console.log("[API Debug] Fetching data from URL:", apiUrl); // Debugging line
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.response.status === "error") {
      //console.error("[API Error] Failed to fetch news:", data.response.message);
      return NextResponse.json(
        { error: "Failed to fetch news. Check API parameters." },
        { status: 500 }
      );
    }

    //console.log("[API Debug] Data fetched successfully:", data.response); // Debugging line
    return NextResponse.json(data.response);
  } catch (err) {
    //console.error("[API Error] An error occurred while fetching news:", err); // Debugging line
    return NextResponse.json(
      { error: "An error occurred while fetching news." },
      { status: 500 }
    );
  }
}
