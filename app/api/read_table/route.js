import { NextResponse } from 'next/server';
import conn from '../../../lib/db';

export async function POST (req) {
  try {
    const body = await req.json();
    const { username } = body;

    const query = `
      SELECT questions.q_id, answers.a_id, questions.question, answers.answer
      FROM savedanswers
      JOIN questions ON savedanswers.q_id = questions.q_id
      JOIN answers ON savedanswers.a_id = answers.a_id
      WHERE savedanswers.username = $1;
    `;

    const result = await conn.query(query, [username]);

    console.log('Query Result:', result.rows);

    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.error({ status: 500, message: 'Internal Server Error' });
  }
}
