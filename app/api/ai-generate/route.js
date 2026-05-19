import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        const prompt = `
Generate:
1. Short summary (max 10 words)
2. Clean URL slug (lowercase, hyphen-separated)

Use BOTH URL and title if title is weak.

URL: ${url}
Title: ${title}

Format:
Summary:
Slug:
`;

        let aiData;

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });

            aiData = await model.generateContent(prompt);

        } catch (error) {

            // fallback model
            try {
                const fallbackModel = genAI.getGenerativeModel({
                    model: "gemini-3-flash-preview",
                });

                aiData = await fallbackModel.generateContent(prompt);

            } catch (fallbackError) {

                // final fallback
                return NextResponse.json({
                    success: false,
                    message: "AI is unavailable right now due to high traffic, please try again later",

                    fallback: {
                        summary: "Generated from URL",

                        slug:
                            url
                                .split("/")
                                .filter(Boolean)
                                .pop()
                                ?.toLowerCase()
                                .replace(/[^a-z0-9]/g, "-") || "short-link",
                    },
                });
            }
        }

        // extract text from res
        const text = aiData.response.text() || ""

        // parse summary
        const summaryMatch =
            text.match(/Summary:\s*(.*)/i) ||
            text.match(/\*\*Summary:\*\*\s*(.*)/i)

        const summary = summaryMatch
            ? summaryMatch[1].trim()
            : "Generated from URL"

        // parse slug
        const slugMatch =
            text.match(/Slug:\s*(.*)/i) ||
            text.match(/\*\*Slug:\*\*\s*(.*)/i)

        const slug = slugMatch
            ? slugMatch[1]
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
            : url
                .split("/")
                .filter(Boolean)
                .pop()
                ?.toLowerCase()
                .replace(/[^a-z0-9]/g, "-") || "short-link"

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