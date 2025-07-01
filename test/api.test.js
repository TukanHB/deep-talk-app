import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../src/app/api/question/route.js';

const originalFetch = global.fetch;
const originalKey = process.env.OPENAI_API_KEY;

test.beforeEach(() => {
  process.env.OPENAI_API_KEY = 'test';
});

test('GET returns question from OpenAI response and uses lang', async () => {
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    const userMsg = body.messages.find((m) => m.role === 'user').content;
    assert.ok(userMsg.includes('auf Englisch'));
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Frage' } }],
      }),
    };
  };

  const req = new Request('http://localhost/api/question?category=Test&lang=Englisch');
  const res = await GET(req);
  const data = await res.json();
  assert.strictEqual(data.question, 'Frage');
});

test('GET handles OpenAI failure', async () => {
  global.fetch = async () => ({ ok: false, text: async () => 'error' });

  const req = new Request('http://localhost/api/question?category=Test&lang=Deutsch');
  const res = await GET(req);
  assert.strictEqual(res.status, 500);
});

test.after(() => {
  global.fetch = originalFetch;
  process.env.OPENAI_API_KEY = originalKey;
});
