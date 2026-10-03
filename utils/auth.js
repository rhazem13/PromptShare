import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })],
  callbacks: {
    async session({ session }) {
      if (!session?.user?.email) return null;
      await connectToDB();
      const user = await User.findOne({ email: session.user.email });
      if (!user) return null;
      session.user.id = user._id.toString();
      return session;
    },
    async signIn({ profile }) {
      if (!profile?.email || !profile.email_verified) return false;
      try {
        await connectToDB();
        const user = await User.findOne({ email: profile.email });
        if (!user) await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });
        return true;
      } catch {
        console.error("Unable to complete sign-in");
        return false;
      }
    },
  },
};
