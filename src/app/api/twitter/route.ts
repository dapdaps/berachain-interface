import { URL } from "url";
import { NextRequest } from "next/server";

export async function GET(request: Request | NextRequest) {
  const parsedUrl = new URL(request.url as string);
  const address = parsedUrl.searchParams.get("address");

  const res = new Response(
    `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="twitter:site" content="@xxx" />
            <meta name="twitter:creator" content="@xxx" />
            <meta name="twitter:card" content="summary_large_image"> <!-- Use 'summary_large_image' for large image cards -->
            <meta name="twitter:title" content="BeraTown">
            <meta name="twitter:description" content="BeraTown Airdrop">
            <meta name="twitter:image" content="https://assets.dapdap.net/airdrop/${address}.png"> <!-- Image URL for sharing -->
            <meta http-equiv="refresh" content="0; url=https://beratown.dapdap.net">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:image:width" content="375">
            <meta property="og:image:height" content="625">
            <title>BeraTown</title>
        </head>
        <body>
        
        </body>
        </html>`,
    {
      status: 200
    }
  );

  res.headers.set("Content-Type", "text/html");

  return res;
}
