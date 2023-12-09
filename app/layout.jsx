import { Inter } from 'next/font/google';
import './globals.css';
import NextAuthProvider from '../utils/sessionProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <body className={'inter.className'}>
        <NextAuthProvider>
          <div className='w-10/12 m-auto text-center bg-white flex flex-col min-h-screen'>
            <div className="grow">{children}</div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
