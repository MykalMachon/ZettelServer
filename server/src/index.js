import fastify from 'fastify';
import MarkdownIt from 'markdown-it';
import * as dotenv from 'dotenv';

// node.js std lib stuff
import path from 'path';
import process from 'process';
import { promises as fs } from 'fs';

// setup fastify app
const app = fastify({ logger: true, ignoreTrailingSlash: true });
const md = MarkdownIt();
dotenv.config();

// setup helper functions
const getContentFile = async (filePath) => {};

// Declare a route
app.get('/', async (request, reply) => {
  const contentFolder = process.env.CONTENT_PATH;
  const indexFile = 'index.md';

  const indexFilePath = path.join(contentFolder, indexFile);

  const fileContent = await fs.readFile(indexFilePath, { encoding: 'utf8' });
  console.log(fileContent);

  return reply
    .status(200)
    .header('Content-Type', 'text/html; charset=utf-8')
    .send(md.render(fileContent));
});

app.get('/:pid', async (request, reply) => {
  const contentFolder = process.env.CONTENT_PATH;
  const indexFile = request.params.pid.replaceAll('/', '');
  console.log(indexFile);

  if (!indexFile)
    return reply.status(401).send({ error: 'no file name attached' });

  const filePath = path.join(contentFolder, `${indexFile}.md`);
  try {
    // check if file exists, will throw if dne
    await fs.access(filePath);
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    return reply
      .status(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(md.render(fileContent));
  } catch (err) {
    return reply.status(404).send({ error: '404: no such file exists' });
  }
});

// Run the server!
const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
