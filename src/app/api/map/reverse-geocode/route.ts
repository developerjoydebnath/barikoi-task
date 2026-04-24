import barikoiClient from "@/shared/lib/barikoiClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const result = await barikoiClient.reverseGeocode({
      latitude: Number(searchParams.get("latitude")),
      longitude: Number(searchParams.get("longitude")),
      district: true,
      bangla: true,
    })

    const place = result.data?.place;

    return NextResponse.json({ place }, {status: 200})
  } catch (error) {
    return NextResponse.json({message: "Failed to fetch autocomplete results", error}, {status: 500})
  }
}