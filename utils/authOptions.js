import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'sign-in',
      id: 'sign-in',
      async authorize (credentials, req) {
        const url = `${process.env.NEXTAUTH_URL}/api/login`;
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' }
        });
        console.log(res);
        const user = await res.json();
        console.log(user);

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
    signIn: '/',
    signOut: null,
    error: '/auth/error' // Error code passed in query string as ?error=
  },

  callbacks: {
    signIn: async ({ account }) => {
      console.log('hello');
      if (account.provider === 'sign-in') {
        return true;
      }
    },

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
