/**
 * @jest-environment node
 */

import { Pool } from 'pg';
import conn from '../lib/db';

// Mock the pg module
jest.mock('pg', () => {
  const mClient = {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => mClient),
    query: jest.fn(() => mClient.query()),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Sample function that uses a database query
async function getUserById(id) {
  const queryText = 'SELECT * FROM users WHERE id = $1';
  const res = await conn.query(queryText, [id]);
  return res.rows;
}

// Tests
describe('Database Connection and Query', () => {
  it('creates a singleton database connection', () => {
    expect(Pool).toHaveBeenCalledTimes(1);
    expect(Pool).toHaveBeenCalledWith({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      ssl: { rejectUnauthorized: false }
    });

    const anotherConn = require('../lib/db').default;
    expect(anotherConn).toBe(conn);
  });

  it('should correctly handle a database query', async () => {
    const userId = 123;
    const users = await getUserById(userId);

    // Check if the query method was called correctly
    expect(conn.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [userId]);

    // Check the returned value
    expect(users).toEqual([]);
  });
});
