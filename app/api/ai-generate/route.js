import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json({
                success: false,
                message: "URL required"
            })
        }
        // fetching webpage HTML
        const res = await fetch(url)
        const html = await res.text()

        // extracting <title>
        let title = "No title"

        // Try title tag
        const titleMatch = html.match(/<title>(.*?)<\/title>/i)
        if (titleMatch) {
            title = titleMatch[1]
        } else {
            // fallback: meta og:title
            const ogMatch = html.match(/property="og:title" content="(.*?)"/i)
            if (ogMatch) {
                title = ogMatch[1]
            }
        }

        // Call gemini API
        const aiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Generate:
1. Short summary (max 10 words)
2. Clean URL slug (lowercase, hyphen-separated)

Use BOTH URL and title if title is weak.

URL: ${url}
Title: ${title}

Format:
Summary:
Slug:`,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

       const aiData = await aiRes.json();

//  Handle Gemini failure
if (aiData.error) {
  console.log("AI ERROR:", aiData.error);

  return NextResponse.json({
    success: true,
    summary: "Generated from URL",
    slug: url
      .split("/")
      .filter(Boolean)
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "-") || "short-link",
  });
}
        console.log("FULL AI RESPONSE:", aiData);
        // extract text from res
        const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || ""
        console.log("AI TEXT:", text)
        // parse summary
        const summaryMatch = text.match(/Summary:\s*(.*)/i) || text.match(/\*\*Summary:\*\*\s*(.*)/i)
        const summary = summaryMatch ? summaryMatch[1].trim() : ""

        // parse slug
        const slugMatch = text.match(/Slug:\s*(.*)/i) || text.match(/\*\*Slug:\*\*\s*(.*)/i)

        const slug = slugMatch
            ? slugMatch[1].trim().toLowerCase().replace(/\s+/g, "-")
            : ""

        // send res to frontend
        return NextResponse.json({
            success: true,
            summary,
            slug
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "AI failed"
        })
    }
}