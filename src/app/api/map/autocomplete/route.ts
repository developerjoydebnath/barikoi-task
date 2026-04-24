import barikoiClient from "@/shared/lib/barikoiClient";
import { NextRequest, NextResponse } from "next/server";


export async function GET (request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  console.log({searchParams})

  try {
    const result = await barikoiClient.autocomplete({
      q: searchParams.get("q") as string,
      bangla: true
    })

    const places = result.data?.places || [];

    return NextResponse.json({ places}, {status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json({message: "Failed to fetch autocomplete results"}, {status: 500})
  }
}