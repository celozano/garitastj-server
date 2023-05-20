require('dotenv').config();

import axios from 'axios';
import cors from 'cors';
import express, { Express, Response } from 'express';
import Redis from 'ioredis';

import { parse } from './utils';

const PORT = process.env.PORT || 3000;
const BWT_URL = process.env.BWT_URL;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_USERNAME = process.env.REDIS_USERNAME;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const app: Express = express();
const redis = new Redis({
  port: 6379,
  host: REDIS_HOST,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  family: 6,
});

app.use(cors({ origin: '*' }));

app.get('/border-wait-times', async (_, res: Response) => {
  try {
    const cache = await redis.get('border-wait-times');
    if (cache) {
      res.send({ ...JSON.parse(cache), source: 'redis' });
      return;
    }

    const response = await axios.get(BWT_URL);
    const data = await parse(response.data);

    redis.set('border-wait-times', JSON.stringify(data), 'EX', 1800);

    res.send(data);
  } catch (error) {
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
