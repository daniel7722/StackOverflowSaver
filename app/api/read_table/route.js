import { NextResponse } from 'next/server';
import { getUserData } from '../../../lib/dbOperations'; // Adjust the path as necessary

export async function POST (req) {
  try {
    const body = await req.json();
    const { username } = body;

    const data = await getUserData(username);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.error({ status: 500, message: 'Internal Server Error' });
  }
}
