import { NextResponse } from 'next/server';
import conn from '../../../lib/db';

export async function POST (req) {
  const body = await req.json(); // res now contains body
  const { username, password } = body;
  try {
    const query = 'SELECT username FROM users WHERE username=$1 AND password=$2';
    const result = await conn.query(query, [username, password]);
    console.log(result);

    if (result.rowCount > 0) {
      return NextResponse.json({ name: `${username}` });
    } else {
      return NextResponse.json({ name: null });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ name: null });
  }
}
