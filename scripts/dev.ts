export {};

const api = Bun.spawn(['bun', 'server.ts'], { stdout: 'inherit', stderr: 'inherit' });
const client = Bun.spawn(['bun', 'run', 'dev:client', '--', '--host', '127.0.0.1'], { stdout: 'inherit', stderr: 'inherit' });

async function stop() {
  api.kill();
  client.kill();
  await Promise.all([api.exited, client.exited]);
  process.exit(0);
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

await Promise.race([api.exited, client.exited]);
await stop();
