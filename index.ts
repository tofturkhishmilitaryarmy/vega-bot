/**
 * @file src/index.ts
 * @description Vega Discord Bot Ana Giriş Noktası (Faz 3)
 */

import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection
} from 'discord.js';
import { ExtendedClient } from './types';
import { config } from './config';
import { logger } from './utils/logger';
import { initDatabase } from './database/db';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';

// Discord Client Oluşturulması (Tüm gerekli Intent ve Partiallar ile)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.GuildScheduledEvent
  ]
}) as ExtendedClient;

// Koleksiyonların tanımlanması
client.commands = new Collection();
client.cooldowns = new Collection();

async function startBot() {
  console.log(`
  ╦  ╦╔═╗╔═╗╔═╗
  ╚╗╔╝║╣ ║ ╦╠═╣
   ╚╝ ╚═╝╚═╝╩ ╩  ${config.name} Bot ${config.version} (Prefix: ${config.prefix} | Slash: /yardim)
  `);

  logger.info('Vega Bot başlatılıyor...', 'Main');
  logger.info(
    `Prefix sistemi aktif ('${config.prefix}'). Tüm komutlar ${config.prefix}komut biçiminde, yalnızca /yardim slash olarak çalışır.`,
    'Main'
  );

  // 1. Veritabanını Başlat (better-sqlite3)
  initDatabase();

  // 2. Komutları Yükle
  loadCommands(client);

  // 3. Olayları Bağla
  loadEvents(client);

  // 4. Discord'a Giriş Yap
  const token = config.token;
  if (!token) {
    logger.warn('DISCORD_TOKEN bulunamadı! Lütfen .env dosyanızı yapılandırın.', 'Auth');
    logger.info('Bot yapılandırması tamamlandı ve hazır.', 'Main');
    return;
  }

  try {
    await client.login(token);
  } catch (error) {
    logger.error('Discord API giriş hatası:', error, 'Auth');
  }
}

// Botu başlat
startBot();

// Beklenmeyen hata yakalayıcılar
process.on('unhandledRejection', (reason, promise) => {
  logger.error('İşlenmemiş Promise Reddi:', reason, 'Process');
});

process.on('uncaughtException', (error) => {
  logger.error('İşlenmemiş İstisna:', error, 'Process');
});

export { client };
