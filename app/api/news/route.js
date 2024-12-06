// /app/api/news/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GUARDIAN_API_KEY; // Add your API key to .env
  const apiUrl = `https://content.guardianapis.com/search?api-key=${apiKey}&show-fields=thumbnail,trailText,byline`;

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
