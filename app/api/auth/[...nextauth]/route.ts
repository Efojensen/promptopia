import User from '@/models/user';
import { connectToDb } from '@utils/database';
import NextAuth, { Session, Profile } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
    ],
    callbacks: {
        async session({ session } : { session: Session }) {
            const sessionUser = await User.findOne({
                email: session.user?.email
            })

            if (session.user && sessionUser) {
                session.user.id = sessionUser._id.toString();
            }

            return session;
        },
        async signIn({ profile } : { profile?: Profile }) {
            try {
                await connectToDb();

                const userExists = await User.findOne({
                    email: profile?.email
                })

                if (!userExists) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replace(' ', '').toLowerCase(),
                        image: profile?.image,
                    })
                }
                return true;
            } catch (error) {
                console.log(error)
                return false;
            }
        }
    },
})

export { handler as GET, handler as POST }