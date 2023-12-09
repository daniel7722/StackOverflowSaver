// POST function in your API route
import { NextResponse } from 'next/server';
import { insertQuestionAndAnswer } from '../../../lib/dbOperations'; // Adjust the path as necessary

export async function POST (req) {
  try {
    const body = await req.json();
    const { question, answer, username } = body;

    await insertQuestionAndAnswer(question, answer, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500
    });
  }
}
