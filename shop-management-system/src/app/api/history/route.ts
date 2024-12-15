import { NextResponse } from "next/server";
import { fetchTransactionHistory } from "../../../../agents/oms";

export async function GET(req: Request) {
  try {
    // Extract query parameters from the request URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1 if not specified
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default to limit 10 if not specified
    const search = url.searchParams.get("search") || ""; // Default to empty string if not specified
    const sortBy = url.searchParams.get("sortBy") || "boughtOn"; // Default to sorting by 'boughtOn'
    const sortOrder = url.searchParams.get("sortOrder") || "asc"; // Default to ascending order
    const order: "asc" | "desc" = sortOrder === "asc" ? "asc" : "desc";

    // Fetch the transaction history using the agent function
    const response = await fetchTransactionHistory(
      search,
      sortBy,
      order,
      page,
      limit
    );

    // Return the response as JSON
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
