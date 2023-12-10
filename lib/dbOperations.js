import conn from './db';

export async function insertQuestionAndAnswer (question, answer, username) {
  const insertQuestionQuery = 'INSERT INTO public.questions (q_id, question) VALUES ($1, $2) ON CONFLICT (q_id) DO NOTHING';
  await conn.query(insertQuestionQuery, [question.q_id, question.question]);

  const insertAnswerQuery = 'INSERT INTO public.answers (a_id, answer) VALUES ($1, $2) ON CONFLICT (a_id) DO NOTHING';
  await conn.query(insertAnswerQuery, [answer.a_id, answer.answer]);

  const insertSavedAnswerQuery = 'INSERT INTO public.savedanswers (username, q_id, a_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING';
  await conn.query(insertSavedAnswerQuery, [username, question.q_id, answer.a_id]);
}

export async function getUserData (username) {
  const query = `
    SELECT questions.q_id, answers.a_id, questions.question, answers.answer
    FROM savedanswers
    JOIN questions ON savedanswers.q_id = questions.q_id
    JOIN answers ON savedanswers.a_id = answers.a_id
    WHERE savedanswers.username = $1;
  `;

  const result = await conn.query(query, [username]);
  return result.rows;
}
