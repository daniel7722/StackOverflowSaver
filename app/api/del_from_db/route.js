import conn from '../../../lib/db';

export async function DELETE (req) {
  try {
    const { q_id, a_id, user } = await req.json();

    console.log('Received delete request for:', { q_id, a_id, user }); // Log received data

    // Start a transaction
    await conn.query('BEGIN');

    // Delete from savedanswers table
    await conn.query('DELETE FROM public.savedanswers WHERE username = $1 AND q_id = $2 AND a_id = $3', [user, q_id, a_id]);

    // Check if there are any other savedanswers for the same question and answer
    const { rows: savedAnswers } = await conn.query('SELECT * FROM public.savedanswers WHERE q_id = $1 OR a_id = $2', [q_id, a_id]);

    if (savedAnswers.length === 0) {
      // If no other savedanswers, delete question and answer
      await conn.query('DELETE FROM public.answers WHERE a_id = $1', [a_id]);
      await conn.query('DELETE FROM public.questions WHERE q_id = $1', [q_id]);
    }

    // Commit the transaction
    await conn.query('COMMIT');
    console.log('Deletion successful for:', { q_id, a_id, user }); // Log on successful deletion

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    console.error('Error in deletion:', error.message); // Log any errors

    await conn.query('ROLLBACK');
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
