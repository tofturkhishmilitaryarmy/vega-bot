/**
 * @file src/config.ts
 * @description Vega Discord Bot genel yapılandırma, renk paletleri ve kimlik ayarları (Faz 3)
 */

import dotenv from 'dotenv';
dotenv.config();

const clientIdForInvite = process.env.CLIENT_ID || process.env.BOT_CLIENT_ID || '';
const invitePermissions = process.env.BOT_INVITE_PERMISSIONS || '0';

export const config = {
  // Bot Kimliği
  name: 'Vega',
  version: 'v3.1.0',
  color: 0x9B59B6, // #9B59B6 (Mor)
  colorHex: '#9B59B6',

  // Prefix Sistemi (Faz 17): Tüm komutlar prefix ile, sadece /yardim slash olarak çalışır
  prefix: process.env.BOT_PREFIX || '.',
  colors: {
    primary: '#9B59B6',
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB'
  },
  links: {
    invite: clientIdForInvite ? `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(clientIdForInvite)}&permissions=${encodeURIComponent(invitePermissions)}&scope=bot%20applications.commands` : '',
    support: process.env.DESTEK_SUNUCUSU || 'https://discord.gg/Hh2yYqk6m'
  },
  // Boş bırakıldığında global bot-sahibi bypass'ı kapalı kalır.
  ownerId: process.env.BOT_OWNER_ID || process.env.OWNER_ID || '',
  clientId: process.env.CLIENT_ID || process.env.BOT_CLIENT_ID || '',
  supportServer: process.env.DESTEK_SUNUCUSU || 'https://discord.gg/Hh2yYqk6m',
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
  dashboardApiToken: process.env.DASHBOARD_API_TOKEN || process.env.WEB_PANEL_TOKEN || '',
  token: process.env.DISCORD_TOKEN || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  
  // AI Yapay Zeka Modelleri (Faz 13)
  ai: {
    defaultModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    fallbackModels: [
      process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash-lite',
      'gemini-3.1-flash-lite'
    ]
  },
  
  // Varsayılan Mesajlar
  errorMessage: 'Bir hata oluştu',
  
  // Bot İkonu / Avatarı
  iconUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  
  // Kategori Listesi ve Eşleşmeleri
  categories: {
    'genel': { name: 'Genel Komutlar', key: 'genel', emoji: '🌐' },
    'bilgi': { name: 'Bilgi Komutları', key: 'bilgi', emoji: '📊' },
    'yetkili': { name: 'Yetkili Komutları', key: 'yetkili', emoji: '🛡️' },
    'koruma': { name: 'Koruma Komutları', key: 'koruma', emoji: '🔒' },
    'muzik': { name: 'Müzik Komutları', key: 'muzik', emoji: '🎵' },
    'ai': { name: 'AI Komutları', key: 'ai', emoji: '🤖' },
    'log': { name: 'Log Komutları', key: 'log', emoji: '📜' },
    'kayit': { name: 'Kayıt Komutları', key: 'kayit', emoji: '📝' },
    'bildirim': { name: 'Bildirim Komutları', key: 'bildirim', emoji: '🔔' },
    'seviye': { name: 'Seviye Komutları', key: 'seviye', emoji: '⭐' },
    'ekonomi': { name: 'Ekonomi Komutları', key: 'ekonomi', emoji: '💰' },
    'cekilis': { name: 'Çekiliş Komutları', key: 'cekilis', emoji: '🎉' },
    'ticket': { name: 'Ticket Komutları', key: 'ticket', emoji: '🎫' },
    'rol': { name: 'Rol Komutları', key: 'rol', emoji: '👑' },
    'giris-cikis': { name: 'Giriş Çıkış Komutları', key: 'giris-cikis', emoji: '🚪' },
    'oneri': { name: 'Öneri & Anket Komutları', key: 'oneri', emoji: '💡' },
    'ozel': { name: 'Özel Komutlar', key: 'ozel', emoji: '⚡' },
    'eglence': { name: 'Eğlence Komutları', key: 'eglence', emoji: '🎮' }
  }
};

export default config;
