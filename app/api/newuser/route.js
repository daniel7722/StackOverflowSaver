import { NextResponse } from 'next/server';
import conn from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST (req) {
  const body = await req.json();
  const { username, password } = body;
  try {
    // check database to see if the username is already used
    const query1 = 'SELECT username FROM users WHERE username=$1';
    const result = await conn.query(query1, [username]);

    if (result.rowCount > 0) {
      return NextResponse.json({ ok: false, message: 'You already have an account/username has been used' });
    } else {
      // hash the password before sending
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const query2 = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        const result = await conn.query(query2, [username, hashedPassword]);
        return NextResponse.json({ ok: true, message: 'Account created' });
      } catch (error) {
        console.error('Error during signup', error);
        return NextResponse.json({ ok: false, message: 'An error occured during signup' });
      }
    }
  } catch (error) {
    console.error('Error during querying:', error);
    return NextResponse.json({ ok: false, message: 'An error occured during signup' });
  }
}
