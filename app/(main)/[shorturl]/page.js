import { redirect, notFound } from "next/navigation";
import getClient from "@/lib/mongodb";

export default async function ShortUrlPage({ params }) {
  const { shorturl } = await params;
 
  

  const client = await getClient();
  const db = client.db("URL_Shorten");
  const collection = db.collection("url");

  const doc = await collection.findOne({ shorturl });
  

  if (!doc || !doc.url.startsWith("http")) {
    notFound();
  }

 const result = await collection.updateOne(
  { _id: doc._id },
  { $inc: { clicks: 1 } }
);

  redirect(doc.url);
}
