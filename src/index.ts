import express, { Request, Response } from 'express';

import path from 'path';
import http from 'http';
import dotenv from 'dotenv';

import routes from 'src/routes';

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

// logging all requests
app.use((req: Request, _res: Response, next: Function) => {
  console.info(`${req.method} - ${req.url}: ${JSON.stringify(req.body, null, 2)}`);
  next();
});

// 404 catch
app.use((_req: Request, _res: Response, next: Function) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

server.listen(port, () => console.log('web listening at port %d', port));

