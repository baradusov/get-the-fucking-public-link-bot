import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Telegraf } from 'telegraf';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import file from './routes/file.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const prepareLink = (file) => {
  const fileName = file.file_name || 'file';
  const url =
    process.env.NODE_ENV == 'development'
      ? process.env.DEV_URL
      : 'https://gtfpl.baradusov.ru';
  return `${url}/api/file?id=${file.file_id}&name=${encodeURIComponent(
    fileName
  )}`;
};

const BOT_TOKEN =
  process.env.NODE_ENV == 'development'
    ? process.env.BOT_TOKEN_DEV
    : process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
  return ctx.reply(
    "Send or forward me a fucking file and I'll give you the fucking public download link without fucking ads. This will only work with files of up to 20 MB in size."
  );
});

bot.on('message', async (ctx) => {
  console.log(JSON.stringify(ctx.update, null, 2));

  if (ctx.message.voice) {
    return ctx.reply(prepareLink(ctx.message.voice), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.document) {
    return ctx.reply(prepareLink(ctx.message.document), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.photo && ctx.message.photo[3]) {
    return ctx.reply(prepareLink(ctx.message.photo[3]), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.photo && ctx.message.photo[2]) {
    return ctx.reply(prepareLink(ctx.message.photo[2]), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.photo && ctx.message.photo[1]) {
    return ctx.reply(prepareLink(ctx.message.photo[1]), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.photo && ctx.message.photo[0]) {
    return ctx.reply(prepareLink(ctx.message.photo[0]), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.video) {
    return ctx.reply(prepareLink(ctx.message.video), {
      reply_to_message_id: ctx.message.message_id,
    });
  }

  if (ctx.message.video_note) {
    return ctx.reply(prepareLink(ctx.message.video_note), {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

const expressApp = express();
expressApp.use(bot.webhookCallback('/api'));

expressApp.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

expressApp.get('/api', (req, res) => {
  res.status(200).send('ok');
});

expressApp.get('/api/file', file);

expressApp.listen(3001, () => {
  console.log(`${process.env.NODE_ENV}: bot listening on port 3001!`);
});
