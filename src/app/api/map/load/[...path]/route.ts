import { appConfig } from "@/shared/configs/app.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Await params per Next.js 15+ requirements
  const { path } = await params;
  const targetPath = path ? path.join("/") : "";
  
  const searchParams = request.nextUrl.searchParams;
  
  // Attach the secure SERVER-SIDE ONLY key
  const apiKey = appConfig.BARIKOI_API_KEY;
  if (apiKey) {
    searchParams.set("key", apiKey);
  }

  const targetUrl = `https://map.barikoi.com/${targetPath}?${searchParams.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      next: { revalidate: 3600 }, // Cache map resources for 1 hour to reduce outgoing requests
    });

    if (!response.ok) {
      return new NextResponse(`Proxy error from Barikoi: ${response.statusText}`, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "";

    // If it's a JSON response (like style.json or vector.json), rewrite URLs inside it
    if (contentType.includes("application/json")) {
      const text = await response.text();

      // Replace Barikoi API endpoints with our secure Next.js proxy
      // Provide the relative or absolute URL to this proxy
      const proxyBaseUrl = `${request.nextUrl.origin}/api/map/load`;
      
      let rewrittenText = text.replace(/https:\/\/map\.barikoi\.com/g, proxyBaseUrl);

      // Strip out any leaked keys that might be baked into the JSON strings
      rewrittenText = rewrittenText.replace(/([?&])key=[^&"']*/g, "");
      
      // Clean up dangling '?' or '&' characters
      rewrittenText = rewrittenText.replace(/\?&/g, "?").replace(/&&/g, "&").replace(/([?&])"/g, '"');

      return new NextResponse(rewrittenText, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Binary / Static files: MVT Protocol Buffers, PNG Sprites, Glyphs (PBF)
    // Stream directly back to the client
    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache tiles for 24 hours
      },
    });

  } catch (error) {
    console.error("Map Proxy Error:", error);
    return new NextResponse("Internal Server Error fetching map data", { status: 500 });
  }
}
