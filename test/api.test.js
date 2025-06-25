import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../src/app/api/question/route.js';

const originalFetch = global.fetch;
const originalKey = process.env.OPENAI_API_KEY;

test.beforeEach(() => {
  process.env.OPENAI_API_KEY = 'test';
});

test('GET returns question from OpenAI response', async () => {
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      choices: [{ message: { content: 'Frage' } }],
    }),
  });

  const req = new Request('http://localhost/api/question?category=Test');
  const res = await GET(req);
  const data = await res.json();
  assert.equal(data.question, 'Frage');
});

test('GET handles OpenAI failure', async () => {
  global.fetch = async () => ({ ok: false, text: async () => 'error' });
  const req = new Request('http://localhost/api/question?category=Test');
  const res = await GET(req);
  assert.equal(res.status, 500);
});

// restore fetch after tests
test.after(() => {
  global.fetch = originalFetch;
  process.env.OPENAI_API_KEY = originalKey;
});

