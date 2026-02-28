import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import getClient from "@/lib/mongodb";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Missing credentials");
        }

        const client = await getClient();
        const db = client.db("URL_Shorten");
        const users = db.collection("users");

        const user = await users.findOne({ email: email.toLowerCase() });

        if (!user) throw new Error("User not registered");
        if (!user.password) throw new Error("Use Google to login");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await getClient();
        const db = client.db("URL_Shorten");
        const users = db.collection("users");

        const existing = await users.findOne({ email: user.email });

        if (!existing) {
          await users.insertOne({
            email: user.email,
            provider: "google",
            createdAt: new Date(),
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const client = await getClient();
        const db = client.db("URL_Shorten");

        const existingUser = await db
          .collection("users")
          .findOne({ email: token.email });

        if (existingUser) {
          token.id = existingUser._id.toString();
        }
      }

      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};