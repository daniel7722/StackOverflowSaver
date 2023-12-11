import conn from '../../../lib/db';

export async function DELETE (req) {
  try {
    const { user } = await req.json();

    console.log('Received delete request for:', { user }); // Log received data

    // Start a transaction
    await conn.query('BEGIN');

    // Delete from savedanswers table
    await conn.query('DELETE FROM public.savedanswers WHERE username = $1', [user]);

    await conn.query('DELETE FROM public.users WHERE username = $1', [user]);

    // Commit the transaction
    await conn.query('COMMIT');
    console.log('Deletion successful for:', { user }); // Log on successful deletion

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
