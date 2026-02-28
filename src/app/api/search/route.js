import { NextResponse } from "next/server";
import connection from "@/lib/connection";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Search query required" }, { status: 400 });
    }

    const [rows] = await connection.execute(
      "SELECT * FROM product WHERE name LIKE ? OR description LIKE ?",
      [`%${query}%`, `%${query}%`]
    );

    return NextResponse.json({ results: rows });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
