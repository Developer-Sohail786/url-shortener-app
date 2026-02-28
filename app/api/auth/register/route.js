export const dynamic = "force-dynamic";

import  bcrypt  from "bcryptjs";
import getClient from "@/lib/mongodb"
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {name,email,password}=await req.json()
            if(!email || !password){
                return NextResponse.json(
                    {message:"Email and Password is required"},
                    {status:400}
                )
            }
        const normalizedEmail=email.toLowerCase()
        const client = await getClient()
        const db=client.db("URL_Shorten")
        const users= db.collection("users")

        const existingUser= await users.findOne({email:normalizedEmail})
        if(existingUser){
            return NextResponse.json(
                {message:"User already exist"},
                {status:409}
            )
        }
        const hashedPassword=await bcrypt.hash(password,10)

        await users.insertOne({
            name,
            email:normalizedEmail,
            password:hashedPassword,
            createdAt:new Date()
        })
        return NextResponse.json(
            {message:"user registered Successfully"},
            {status:201}
        )
    } catch (error) {
        console.error("REGISTER FAILED",error);
        return NextResponse.json(
            {message:"Registration failed"},
            {status:500}
        )
        
    }
}