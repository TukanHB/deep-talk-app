import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../src/app/api/question/route.js';

const originalFetch = global.fetch;
const originalKey = process.env.OPENAI_API_KEY;

test.beforeEach(() => {
  process.env.OPENAI_API_KEY = 'test';
});

t1jwym-codex/ki-gestützte-fragen-generieren
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
main
});

test('GET handles OpenAI failure', async () => {
  global.fetch = async () => ({ ok: false, text: async () => 'error' });
t1jwym-codex/ki-gestützte-fragen-generieren

  const req = new Request('http://localhost/api/question?category=Test&lang=Deutsch');
  const res = await GET(req);
  assert.strictEqual(res.status, 500);
});


  const req = new Request('http://localhost/api/question?category=Test');
  const res = await GET(req);
  assert.equal(res.status, 500);
});

// restore fetch after tests
main
test.after(() => {
  global.fetch = originalFetch;
  process.env.OPENAI_API_KEY = originalKey;
});
t1jwym-codex/ki-gestützte-fragen-generieren


main
