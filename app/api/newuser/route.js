import { NextResponse } from 'next/server';
import conn from '../../../lib/db';

export async function POST (req) {
  const body = await req.json(); // res now contains body
  const { username, password } = body;
  try {
    const query1 = 'SELECT username FROM users WHERE username=$1';
    const result = await conn.query(query1, [username]);
    console.log(result);

    if (result.rowCount > 0) {
      return NextResponse.json({ ok: false, message: 'You already have an account' });
    } else {
      try {
        const query2 = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        const result = await conn.query(query2, [username, password]);
        console.log(result);
        return NextResponse.json({ ok: true, message: 'Account created' });
      } catch (error) {
        console.error('Error during signup', error);
        return NextResponse.jsono({ ok: false, message: 'An error occured during signup' });
      }
    }
  } catch (error) {
    console.error('Error during querying:', error);
    return NextResponse.json({ ok: false, message: 'An error occured during signup' });
  }
}
