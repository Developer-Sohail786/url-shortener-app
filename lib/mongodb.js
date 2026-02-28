import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("MONGODB_URI is not defined")
}

let client
let clientPromise

if (!global._mongoClient) {
  client = new MongoClient(uri)
  global._mongoClient = client
}

client = global._mongoClient

export default async function getClient() {
  if (!clientPromise) {
    clientPromise = client.connect()
  }
  return clientPromise
}