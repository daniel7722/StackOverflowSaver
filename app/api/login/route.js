import { NextResponse } from 'next/server';
import conn from '../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST (req) {
  const body = await req.json();
  const { username, password } = body;

  try {
    // fetch username and password from database where username match
    const query = 'SELECT username, password FROM users WHERE username=$1';
    const result = await conn.query(query, [username]);
    const hashedPassword = result.rows[0].password;

    // check if the bcrypted password match with password in database
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (result.rowCount > 0 && isMatch) {
      // only return username for displaying on website
      return NextResponse.json({ name: `${username}` });
    } else {
      return NextResponse.json({ name: null });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ name: null });
  }
}
