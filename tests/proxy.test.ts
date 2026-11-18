import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import { createApp } from '../server/app';
import { readConfig } from '../server/config';
import { fetchSounds, playSound } from '../src/services/api';

const listen = async (server: Server) => {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
};

test('proxies current Soundbored JSON and translates tenant errors', async (t) => {
  let catalogReply = { status: 200, type: 'application/json', body: JSON.stringify({
    data: [{ id: 1, filename: 'bell.mp3', tags: ['reaction'], is_join_sound: null }],
  }) };
  const upstream = createServer((req, res) => {
    if (req.headers.authorization !== 'Bearer fixture-token') {
      res.writeHead(401, { 'Content-Type': 'application/json' }).end('{"error":"Invalid API token"}');
    } else if (req.method === 'GET' && req.url === '/api/sounds') {
      res.writeHead(catalogReply.status, { 'Content-Type': catalogReply.type }).end(catalogReply.body);
    } else if (req.method === 'POST' && req.url === '/api/sounds/1/play') {
      res.writeHead(202, { 'Content-Type': 'application/json' }).end('{"data":{"status":"accepted"}}');
    } else if (req.method === 'POST' && req.url === '/api/sounds/stop') {
      res.writeHead(204).end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' }).end('{"error":"Sound not found"}');
    }
  });
  t.after(() => upstream.close());
  const upstreamUrl = await listen(upstream);
  const proxy = createServer(createApp(readConfig({
    SOUNDBORED_API_URL: upstreamUrl,
    SOUNDBORED_API_TOKEN: 'fixture-token',
  }), process.cwd() + '/dist'));
  t.after(() => proxy.close());
  const proxyUrl = await listen(proxy);
  const fetch = globalThis.fetch;
  t.mock.method(globalThis, 'fetch', (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(typeof input === 'string' && input.startsWith('/') ? proxyUrl + input : input, init);
  });

  const [sound] = await fetchSounds();
  assert.equal(sound.filename, 'bell.mp3');
  assert.deepEqual(sound.tags, ['reaction']);
  await playSound(sound.id);
  await assert.rejects(playSound(2), /Sound not found/);
  assert.equal((await fetch(proxyUrl + '/api/sounds/stop', { method: 'POST' })).status, 204);

  catalogReply = { status: 403, type: 'text/plain; charset=utf-8', body: 'You are not a member of this soundboard' };
  await assert.rejects(fetchSounds(), /You are not a member of this soundboard/);
  catalogReply = { status: 404, type: 'text/plain', body: 'Unknown soundboard' };
  await assert.rejects(fetchSounds(), /Unknown soundboard/);

  catalogReply = { status: 200, type: 'text/html', body: '<title>Gateway status</title>' };
  const response = await fetch(proxyUrl + '/api/sounds');
  assert.equal(response.status, 502);
  assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
  assert.match((await response.json()).error, /invalid API response/);
});
