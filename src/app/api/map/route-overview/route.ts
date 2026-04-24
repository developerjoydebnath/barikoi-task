import barikoiClient from "@/shared/lib/barikoiClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const profile = searchParams.get("profile") as "car" | "foot" || 'car';
  const geometries = searchParams.get("geometries") as "geojson" | "polyline" || 'geojson' || 'geojson';

  if (!start || !end) {
    return NextResponse.json({ message: "Start and end coordinates are required" }, { status: 400 })
  }

  try {

    const result = await barikoiClient.routeOverview({
      coordinates: `${start};${end}`,
      geometries: geometries,
      profile: profile,
    });

    const routes = result.data?.routes;
    const waypoints = result.data?.waypoints;

    return NextResponse.json({ routes, waypoints }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch autocomplete results", error }, { status: 500 })
  }
}