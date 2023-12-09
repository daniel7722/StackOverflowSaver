import Head from 'next/head';
import Login from '../components/login/Login';
// import Loginstatus from '../component/loginStatus';

export default function Home () {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login/Signup</title>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link> */}
      </Head>
      <div className='loginContainer'>
        <Login />
      </div>
    </>
  );
}
