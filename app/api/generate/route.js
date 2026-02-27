export const dynamic = "force-dynamic";
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session=await getServerSession(authOptions)
    if(!session){
      return NextResponse.json(
        {success:false, message:"Unauthorized"},
        {status:401}
      )
    }

    const userId=session.user.id
    const { url, shorturl } = await req.json()

    
    if (!url || !shorturl) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      )
    }

    
    const client = await clientPromise
    const db = client.db("URL_Shorten")

    
    const existing = await db.collection("url").findOne({ shorturl })
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Short URL already exists" },
        { status: 409 }
      )
    }

    
    await db.collection("url").insertOne({
      url,
      shorturl,
      clicks: 0,
      userId,
      createdAt: new Date()
    })

    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
