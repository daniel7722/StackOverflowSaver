import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'sign-in',
      async authorize (credentials, req) {
        const url = `${process.env.NEXTAUTH_URL}/api/login`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json();

        if (user.name) {
          return user;
        } else {
          return null;
        }
      }
    }),
    Credentials({
      id: 'sign-up',
      async authorize (credentials, req) {
        const url = `${process.env.NEXTAUTH_URL}/api/newuser`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        });
        const user = await res.json();
        if (user.name) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },

  pages: {
    signIn: '/login-signup',
    signOut: null,
    error: '/auth/error' // Error code passed in query string as ?error=
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
};
