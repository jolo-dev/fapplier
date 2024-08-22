import { describe, expect, it } from 'vitest';
import { handler } from '../src/functions/auth';
describe('auth', async () => {
  it.only('should authenticate user', async () => {
    const result = await fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'johnyscrazy@gmail.com',
      }),
    });
    const user = await result.json();
    console.log('Result:', user);
  });
});
