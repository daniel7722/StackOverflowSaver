import { NextResponse } from 'next/server';
import { getUserData } from '../../../lib/dbOperations'; // Adjust the path as necessary
<<<<<<< HEAD

=======
>>>>>>> 089edd23d5b4fe645237fe19164acf7433efb5ad
export async function POST (req) {
  try {
    const body = await req.json();
    const { username } = body;

    const data = await getUserData(username);

    return NextResponse.json({ data });
<<<<<<< HEAD
=======
)
>>>>>>> 089edd23d5b4fe645237fe19164acf7433efb5ad
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.error({ status: 500, message: 'Internal Server Error' });
  }
}
