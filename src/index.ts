require('dotenv').config();

import axios from 'axios';
import cors from 'cors';
import express, { Express, Response } from 'express';

import { parse } from './utils';

const PORT = process.env.PORT || 3000;
const BWT_URL = process.env.BWT_URL;

const app: Express = express();

app.use(cors({ origin: '*' }));

app.get('/border-wait-times', async (_, res: Response) => {
  try {
    const response = await axios.get(BWT_URL);
    const json = await parse(response.data);

    res.send(json);
  } catch (error) {
    res.status(500).send('Something went wrong.');
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
