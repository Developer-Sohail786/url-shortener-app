export const dynamic = "force-dynamic";

import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "../auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb";


export async function POST(req) {
  try {
    const session= await getServerSession(authOptions)
    if(!session){
      return NextResponse.json(
        {success:false, message:"Unauthorized"},
        {status:401}
      )
    }
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id" },
        { status: 400 }
      )
    }

    
    const client = await clientPromise
    const db = client.db("URL_Shorten")

    
   const result= await db.collection("url").deleteOne({
      _id: new ObjectId(id),
      userId:session.user.id
    })

    if(result.deletedCount===0){
      return NextResponse.json(
        {success:false,message:"Not allowed"},
        {status:403}
      )
    }
  
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE URL ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
