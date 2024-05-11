require('dotenv').config();

import axios from 'axios';
import cors from 'cors';
import express, { Express, Response } from 'express';
import NodeCache from 'node-cache';

import { parse } from './utils';

const PORT = process.env.PORT || 3000;
const BWT_URL = process.env.BWT_URL;
const STD_TTL = process.env.STD_TTL || 600;

const app: Express = express();
const nodeCache = new NodeCache();

app.use(cors({ origin: '*' }));

app.get('/border-wait-times', async (_, res: Response) => {
  try {
    const cache: any = nodeCache.get('border-wait-times');
    if (cache) {
      res.send({ ...JSON.parse(cache), source: 'cache' });
      return;
    }

    const response = await axios.get(BWT_URL);
    const data = await parse(response.data);

    nodeCache.set('border-wait-times', JSON.stringify(data), STD_TTL);

    res.send(data);
  } catch (error) {
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
