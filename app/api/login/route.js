import { NextResponse } from 'next/server';
import conn from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST (req) {
  const body = await req.json(); // res now contains body
  const { username, password } = body;

  try {
    const query = 'SELECT username, password FROM users WHERE username=$1';
    const result = await conn.query(query, [username]);
    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (result.rowCount > 0 && isMatch) {
      return NextResponse.json({ name: `${username}` });
    } else {
      return NextResponse.json({ name: null });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ name: null });
  }
}
