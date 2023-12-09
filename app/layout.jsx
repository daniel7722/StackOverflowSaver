import { Ropa_Sans } from 'next/font/google';
import './globals.css';
import NextAuthProvider from '../utils/sessionProvider';

const ropa_Sans = Ropa_Sans({
  style: ['normal'],
  subsets: ['latin'],
  weight: '400',
  display: 'swap'
});

export default function RootLayout ({ children }) {
  return (
    <html lang="en">
      <body className={'ropa_Sans.className'}>
        <NextAuthProvider>
            <div className="grow">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
