import conn from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST (req) {
  try {
    const body = await req.json();
    const { question, answer, username } = body;

    const insertQuestionQuery = 'INSERT INTO public.questions (q_id, question) VALUES ($1, $2) ON CONFLICT (q_id) DO NOTHING';
    await conn.query(insertQuestionQuery, [question.q_id, question.question]);

    const insertAnswerQuery = 'INSERT INTO public.answers (a_id, answer) VALUES ($1, $2) ON CONFLICT (a_id) DO NOTHING';
    await conn.query(insertAnswerQuery, [answer.a_id, answer.answer]);

    const insertSavedAnswerQuery = 'INSERT INTO public.savedanswers (username, q_id, a_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING';
    await conn.query(insertSavedAnswerQuery, [username, question.q_id, answer.a_id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500
    });
  }
}
