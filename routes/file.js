import dotenv from 'dotenv';
dotenv.config();

import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

const BOT_TOKEN =
  process.env.NODE_ENV == 'development'
    ? process.env.BOT_TOKEN_DEV
    : process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

export default async (req, res) => {
  try {
    const fileLink = await bot.telegram.getFileLink(req.query.id);
    const response = await fetch(fileLink);

    res.set('Content-Disposition', `attachment; filename="${req.query.name}"`);
    response.body.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.description);
  }
};
