import Head from 'next/head';
import Login from '../component/Login';
// import Loginstatus from '../component/loginStatus';

export default function Home () {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login/Signup</title>
      </Head>
      <Login />
    </>
  );
}
