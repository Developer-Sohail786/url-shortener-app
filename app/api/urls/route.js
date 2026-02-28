export const dynamic = "force-dynamic";
import { NextResponse } from "next/server"
import getClient from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session=await getServerSession(authOptions)
    if(!session){
      return NextResponse.json(
        {success:false,message:"Unauthorized"},
        {status:201}
      )
    }

    const userId=session.user.id
   const client = await getClient()
    const db = client.db("URL_Shorten")

    
    const urls = await db
      .collection("url")
      .find({userId})
      .sort({ createdAt: -1 }) // optional: latest first
      .toArray()

    
    return NextResponse.json({
      success: true,
      data: urls
    })
  } catch (error) {
    console.error("GET URLS ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
