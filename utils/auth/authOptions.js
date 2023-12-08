import Credentials from "next-auth/providers/credentials";

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            id: "sign-in",
            async authorize(credentials, req) {;
                const {username} = credentials;
                const user = { name: username};

                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        })],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },

    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.accessToken = user.token;
                // token.provider = account.provider;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.accessToken = token.accessToken;
                // session.provider = token.provider;
                session.user = token.name;
            }
            return session;
        }
    }
}