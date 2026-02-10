import { redirect, notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";

export default async function ShortUrlPage({ params }) {
 const { shorturl } = await params;

    const client = await clientPromise;
    const db = client.db("URL_Shorten");
    const collection = db.collection("url");

    const doc = await collection.findOne({ shorturl });

    if (!doc || !doc.url.startsWith("http")) {
      notFound();
    }

    await collection.updateOne(
      { shorturl },
      { $inc: { clicks: 1 } }
    );
  redirect(doc.url);
}
