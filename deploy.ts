/**
 * @file src/deploy.ts
 * @description Only /yardim is deployed as a Discord slash command; all other
 * commands stay in the dot-prefix registry. This one-time deploy also clears
 * obsolete guild-scoped application commands from every guild the bot is in.
 */

import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { allCommands } from './commands';
import { config } from './config';
import { logger } from './utils/logger';
import { SLASH_DEPLOY_COMMANDS } from './utils/prefixHandler';

async function deploy() {
  const token = (process.env.DISCORD_TOKEN || config.token || '').trim();
  const configuredClientId = (process.env.CLIENT_ID || process.env.BOT_CLIENT_ID || config.clientId || '').trim();

  if (!token) {
    logger.error('DISCORD_TOKEN bulunamadı! .env dosyasında DISCORD_TOKEN tanımlayın.', undefined, 'Deploy');
    process.exitCode = 1;
    return;
  }

  const slashCommands = allCommands.filter(cmd => SLASH_DEPLOY_COMMANDS.has(cmd.data.name));
  const prefixCommands = allCommands.filter(cmd => !SLASH_DEPLOY_COMMANDS.has(cmd.data.name));
  const commandData = slashCommands.map(cmd => cmd.data.toJSON());

  // Fail closed: never send an accidental broad command list to the API.
  if (commandData.length !== 1 || commandData[0]?.name !== 'yardim') {
    logger.error('Slash dağıtımı durduruldu: Discord API listesi yalnızca /yardim içermelidir.', undefined, 'Deploy');
    process.exitCode = 1;
    return;
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  try {
    const ready = new Promise<void>((resolve, reject) => {
      client.once(Events.ClientReady, () => resolve());
      client.once(Events.Error, reject);
    });
    await client.login(token);
    await ready;

    const loggedInClientId = client.user?.id;
    if (!loggedInClientId) throw new Error('Bot kimliği Gateway oturumundan doğrulanamadı.');
    if (configuredClientId && configuredClientId !== loggedInClientId) {
      throw new Error('CLIENT_ID, kullanılan bot tokeninin kimliğiyle eşleşmiyor; dağıtım güvenlik için durduruldu.');
    }

    logger.info(`Discord API listesi hazırlanıyor: 1 global slash (/yardim), ${prefixCommands.length} prefix komutu.`, 'Deploy');
    await rest.put(Routes.applicationCommands(loggedInClientId), { body: commandData });
    const deployedGlobal = await rest.get(Routes.applicationCommands(loggedInClientId)) as any;
    if (!Array.isArray(deployedGlobal) || deployedGlobal.length !== 1 || deployedGlobal[0]?.name !== 'yardim') {
      throw new Error('Discord API doğrulaması başarısız: global komut listesi yalnızca /yardim değil.');
    }

    // Guild-scoped commands override/hide globals in Discord's menu. Purge old
    // entries so only the global /yardim remains visible after propagation.
    let removedGuildCommandCount = 0;
    let cleanedGuildCount = 0;
    for (const guildId of client.guilds.cache.keys()) {
      const existing = await rest.get(Routes.applicationGuildCommands(loggedInClientId, guildId)) as any;
      if (Array.isArray(existing) && existing.length > 0) {
        await rest.put(Routes.applicationGuildCommands(loggedInClientId, guildId), { body: [] });
        removedGuildCommandCount += existing.length;
        cleanedGuildCount += 1;
      }
      const remainingGuildCommands = await rest.get(Routes.applicationGuildCommands(loggedInClientId, guildId)) as any;
      if (!Array.isArray(remainingGuildCommands) || remainingGuildCommands.length !== 0) {
        throw new Error(`Discord API doğrulaması başarısız: bir sunucuda eski slash komutları kaldı.`);
      }
    }

    logger.success(
      `/yardim global olarak kaydedildi; ${cleanedGuildCount} sunucudaki ${removedGuildCommandCount} eski sunucu-özel slash komutu temizlendi. ${prefixCommands.length} komut '${config.prefix}' önekiyle prefix olarak kaldı.`,
      'Deploy'
    );
  } catch (error) {
    logger.error("Komutlar Discord API'ye aktarılırken hata oluştu:", error, 'Deploy');
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
}

deploy();
