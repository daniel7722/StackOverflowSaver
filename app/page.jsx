import Head from 'next/head';
import Login from '../components/login/Login';
export default function Home () {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login/Signup</title>
      </Head>
      <div className='loginContainer'>
        <Login />
      </div>
    </>
  );
}
