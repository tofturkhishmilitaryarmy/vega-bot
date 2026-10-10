/**
 * @file src/App.tsx
 * @description Vega Discord Bot 7/24 Web Yönetim Paneli (Faz 14)
 * - 13 Kapsamlı Yönetim Bölümü (Dashboard, Bot Kontrol, Durum & Önizleme, İstatistikler, Sunucular, Ayarlar, Güvenlik, Otomatik Cevaplar, Kullanıcılar, Loglar, Veritabanı, Bot Ayarları, Komut Rehberi)
 * - Vega Moru (#9B59B6) ve Modern Glassmorphism Tasarım
 * - Dark Mode / Light Mode Desteği
 * - Mobil ve Masaüstü Uyumlu Tamamen Responsive Arayüz
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Server,
  BookOpen,
  Copy,
  Check,
  Code2,
  Database,
  ExternalLink,
  Bot,
  Sparkles,
  Download,
  FolderArchive,
  Search,
  FileCode,
  CheckCircle2,
  ArrowDownToLine,
  Play,
  Square,
  RotateCw,
  Activity,
  Terminal,
  Cpu,
  Users,
  Radio,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  Layers,
  Trash2,
  Globe,
  CheckCircle,
  Sliders,
  MessageSquare,
  Lock,
  Send,
  Plus,
  Edit2,
  Sun,
  Moon,
  TrendingUp,
  Volume2,
  Tv,
  Gamepad2,
  Headphones,
  Award,
  Zap,
  BarChart3,
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react';
import { PerformanceMetricsChart } from './components/PerformanceMetricsChart';

interface BotStatus {
  running: boolean;
  status: string;
  botTag: string | null;
  botId: string | null;
  avatar: string | null;
  ping: number;
  uptime: string;
  uptimeSeconds?: number;
  guildsCount: number;
  usersCount: number;
  channelsCount: number;
  totalCommands: number;
  memoryMB: number;
  tokenConfigured: boolean;
  startTime?: number | null;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  tag: string;
  message: string;
}

interface GuildItem {
  id: string;
  name: string;
  memberCount: number;
  icon: string | null;
}

interface AutoResponseItem {
  id: number;
  guild_id: string;
  trigger: string;
  response: string;
  match_type: 'exact' | 'contains' | 'startsWith' | 'endsWith';
  is_regex: number;
  created_at: string;
}

interface UserItem {
  id: string;
  guild_id: string;
  xp: number;
  level: number;
  balance: number;
  bank_balance?: number;
  warnings: number;
  rep?: number;
}

type TabType =
  | 'dashboard'
  | 'bot-control'
  | 'presence'
  | 'stats'
  | 'guilds'
  | 'guild-settings'
  | 'security'
  | 'auto-responses'
  | 'users'
  | 'logs'
  | 'database'
  | 'bot-settings'
  | 'commands';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [guilds, setGuilds] = useState<GuildItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [topCommands, setTopCommands] = useState<Array<{ command: string; count: number }>>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [presenceHistory, setPresenceHistory] = useState<any[]>([]);

  // Seçili Sunucu
  const [selectedGuildId, setSelectedGuildId] = useState<string>('');
  const [guildDetails, setGuildDetails] = useState<any>(null);

  // Form State'leri
  const [tokenInput, setTokenInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Bot Mesaj Gönder Formu
  const [msgChannelId, setMsgChannelId] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedDesc, setEmbedDesc] = useState('');
  const [embedColor, setEmbedColor] = useState('#9B59B6');

  // Bot Durumu Formu
  const [presenceType, setPresenceType] = useState('PLAYING');
  const [presenceText, setPresenceText] = useState('/yardım | v14.0 | Vega Asistan');
  const [streamingUrl, setStreamingUrl] = useState('https://twitch.tv/vega');
  const [presenceStatus, setPresenceStatus] = useState('online');

  // Güvenlik Ayarları
  const [secSpamLimitMsg, setSecSpamLimitMsg] = useState(5);
  const [secSpamLimitSec, setSecSpamLimitSec] = useState(4);
  const [secCapsPercent, setSecCapsPercent] = useState(70);
  const [secRaidJoins, setSecRaidJoins] = useState(5);
  const [secRaidSec, setSecRaidSec] = useState(10);
  const [secRaidLockDuration, setSecRaidLockDuration] = useState(10);
  const [secBadWordsInput, setSecBadWordsInput] = useState('');
  const [secBadWordsList, setSecBadWordsList] = useState<string[]>([]);
  const [secBannedDomainsInput, setSecBannedDomainsInput] = useState('');
  const [secBannedDomainsList, setSecBannedDomainsList] = useState<string[]>([]);

  // Otomatik Cevaplar
  const [autoResponses, setAutoResponses] = useState<AutoResponseItem[]>([]);
  const [newArTrigger, setNewArTrigger] = useState('');
  const [newArResponse, setNewArResponse] = useState('');
  const [newArMatchType, setNewArMatchType] = useState<'exact' | 'contains' | 'startsWith' | 'endsWith'>('contains');
  const [newArIsRegex, setNewArIsRegex] = useState(false);

  // Kullanıcı Yönetimi
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Veritabanı Yönetimi
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [selectedDbTable, setSelectedDbTable] = useState('guilds');
  const [tableData, setTableData] = useState<{ rows: any[]; columns: string[]; total: number }>({ rows: [], columns: [], total: 0 });

  // Global Bot Ayarları
  const [botPrefix, setBotPrefix] = useState('!');
  const [botLang, setBotLang] = useState('tr');
  const [botAutoDelete, setBotAutoDelete] = useState(5);
  const [botMaintenance, setBotMaintenance] = useState(false);
  const [botOwnerId, setBotOwnerId] = useState('');

  // Log Filtresi
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'success' | 'warn' | 'error'>('all');
  const [logSearch, setLogSearch] = useState('');

  // Canlı Sayaçlar (Uptime)
  const [liveSeconds, setLiveSeconds] = useState(0);

  const [dashboardToken, setDashboardToken] = useState('');

  const saveDashboardToken = (nextToken: string) => {
    const cleanToken = nextToken.trim();
    if (cleanToken) {
      localStorage.setItem('vega_dashboard_token', cleanToken);
      setDashboardToken(cleanToken);
      showToast('Dashboard token kaydedildi.');
    } else {
      localStorage.removeItem('vega_dashboard_token');
      setDashboardToken('');
      showToast('Dashboard token temizlendi.', 'error');
    }
  };

  // Bildirim Gösterme
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 4000);
  };

  useEffect(() => {
    setDashboardToken(localStorage.getItem('vega_dashboard_token') || '');
  }, []);

  // Veri Çekme
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
        if (data.uptimeSeconds) setLiveSeconds(data.uptimeSeconds);
      }
    } catch {}
  };

  const fetchGuilds = async () => {
    try {
      const res = await fetch('/api/bot/guilds');
      if (res.ok) {
        const data = await res.json();
        setGuilds(data.guilds || []);
        if (data.guilds?.length > 0 && !selectedGuildId) {
          setSelectedGuildId(data.guilds[0].id);
        }
      }
    } catch {}
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/bot/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {}
  };

  const fetchCommandStats = async () => {
    try {
      const res = await fetch('/api/bot/command-stats');
      if (res.ok) {
        const data = await res.json();
        setTopCommands(data.topCommands || []);
        setCategoryStats(data.categoryCounts || {});
      }
    } catch {}
  };

  const fetchPresenceHistory = async () => {
    try {
      const res = await fetch('/api/bot/presence/history');
      if (res.ok) {
        const data = await res.json();
        setPresenceHistory(data.history || []);
      }
    } catch {}
  };

  const fetchGuildDetails = async (gId: string) => {
    if (!gId) return;
    try {
      const res = await fetch(`/api/bot/guilds/${gId}`);
      if (res.ok) {
        const data = await res.json();
        setGuildDetails(data);

        // Güvenlik ayarlarını doldur
        const conf = data.config || {};
        setSecSpamLimitMsg(conf.spam_limit_messages || 5);
        setSecSpamLimitSec(conf.spam_limit_seconds || 4);
        setSecCapsPercent(conf.caps_limit_percent || 70);
        setSecRaidJoins(conf.raid_limit_joins || 5);
        setSecRaidSec(conf.raid_limit_seconds || 10);
        setSecRaidLockDuration(conf.raid_lock_duration || 10);
        try {
          setSecBadWordsList(JSON.parse(conf.custom_bad_words || '[]'));
        } catch {
          setSecBadWordsList([]);
        }
        try {
          setSecBannedDomainsList(JSON.parse(conf.banned_domains || '[]'));
        } catch {
          setSecBannedDomainsList([]);
        }
      }
    } catch {}
  };

  const fetchAutoResponses = async (gId: string) => {
    if (!gId) return;
    try {
      const res = await fetch(`/api/guilds/${gId}/auto-responses`);
      if (res.ok) {
        const data = await res.json();
        setAutoResponses(data.responses || []);
      }
    } catch {}
  };

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams();
      if (selectedGuildId) query.set('guildId', selectedGuildId);
      if (userSearch) query.set('search', userSearch);
      const res = await fetch(`/api/users?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch {}
  };

  const fetchDbTables = async () => {
    try {
      const res = await fetch('/api/db/tables');
      if (res.ok) {
        const data = await res.json();
        setDbTables(data.tables || []);
      }
    } catch {}
  };

  const fetchTableData = async (tName: string) => {
    if (!tName) return;
    try {
      const res = await fetch(`/api/db/table/${tName}?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setTableData(data);
      }
    } catch {}
  };

  const fetchBotSettings = async () => {
    try {
      const res = await fetch('/api/bot/settings');
      if (res.ok) {
        const data = await res.json();
        setBotPrefix(data.prefix || '!');
        setBotLang(data.language || 'tr');
        setBotAutoDelete(data.autoDeleteSeconds || 5);
        setBotMaintenance(Boolean(data.maintenanceMode));
        setBotOwnerId(data.ownerId || '');
      }
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    fetchGuilds();
    fetchLogs();
    fetchCommandStats();
    fetchPresenceHistory();
    fetchDbTables();
    fetchBotSettings();

    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
      setLiveSeconds(prev => prev + 2);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedGuildId) {
      fetchGuildDetails(selectedGuildId);
      fetchAutoResponses(selectedGuildId);
      fetchUsers();
    }
  }, [selectedGuildId]);

  useEffect(() => {
    if (selectedDbTable) {
      fetchTableData(selectedDbTable);
    }
  }, [selectedDbTable]);

  // Bot Başlat/Durdur/Restart İşlemleri
  const handleBotAction = async (action: 'start' | 'stop' | 'restart') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bot/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || `Bot başarıyla ${action === 'start' ? 'başlatıldı' : action === 'stop' ? 'durduruldu' : 'yeniden başlatıldı'}!`);
      } else {
        showToast(data.message || 'İşlem başarısız oldu.', 'error');
      }
      fetchStatus();
    } catch (e: any) {
      showToast(e.message || 'Bağlantı hatası', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Bot Durumunu Uygula
  const handleSavePresence = async () => {
    try {
      const res = await fetch('/api/bot/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: presenceType,
          text: presenceText,
          streamingUrl: presenceType === 'STREAMING' ? streamingUrl : undefined,
          status: presenceStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Bot durumu anında güncellendi!');
        fetchPresenceHistory();
      } else {
        showToast(data.message || 'Durum ayarlanamadı', 'error');
      }
    } catch {
      showToast('Bağlantı hatası', 'error');
    }
  };

  // Mesaj Gönder
  const handleSendMessage = async () => {
    if (!msgChannelId || !msgContent) {
      return showToast('Lütfen kanal ID ve mesaj metni girin.', 'error');
    }
    try {
      const res = await fetch('/api/bot/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: msgChannelId, message: msgContent })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setMsgContent('');
      } else {
        showToast(data.message || 'Mesaj iletilemedi', 'error');
      }
    } catch {
      showToast('Bağlantı hatası', 'error');
    }
  };

  // Embed Gönder
  const handleSendEmbed = async () => {
    if (!msgChannelId || !embedTitle || !embedDesc) {
      return showToast('Lütfen kanal ID, başlık ve açıklama girin.', 'error');
    }
    try {
      const res = await fetch('/api/bot/send-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: msgChannelId,
          title: embedTitle,
          description: embedDesc,
          color: embedColor
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setEmbedTitle('');
        setEmbedDesc('');
      } else {
        showToast(data.message || 'Embed iletilemedi', 'error');
      }
    } catch {
      showToast('Bağlantı hatası', 'error');
    }
  };

  // Güvenlik Ayarlarını Kaydet
  const handleSaveSecurity = async () => {
    if (!selectedGuildId) return;
    try {
      const res = await fetch(`/api/guilds/${selectedGuildId}/security-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spamLimitMessages: Number(secSpamLimitMsg),
          spamLimitSeconds: Number(secSpamLimitSec),
          capsLimitPercent: Number(secCapsPercent),
          raidLimitJoins: Number(secRaidJoins),
          raidLimitSeconds: Number(secRaidSec),
          raidLockDuration: Number(secRaidLockDuration),
          customBadWords: secBadWordsList,
          bannedDomains: secBannedDomainsList
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Güvenlik ve koruma ayarları başarıyla kaydedildi!');
      } else {
        showToast('Ayarlar kaydedilemedi', 'error');
      }
    } catch {
      showToast('Bağlantı hatası', 'error');
    }
  };

  // Otomatik Cevap Ekle
  const handleAddAutoResponse = async () => {
    if (!selectedGuildId || !newArTrigger || !newArResponse) {
      return showToast('Tetikleyici ve cevap alanlarını doldurun.', 'error');
    }
    try {
      const res = await fetch(`/api/guilds/${selectedGuildId}/auto-responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: newArTrigger,
          response: newArResponse,
          matchType: newArMatchType,
          isRegex: newArIsRegex
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Otomatik cevap başarıyla eklendi!');
        setNewArTrigger('');
        setNewArResponse('');
        fetchAutoResponses(selectedGuildId);
      } else {
        showToast('Eklenirken hata oluştu', 'error');
      }
    } catch {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleDeleteAutoResponse = async (id: number) => {
    if (!selectedGuildId) return;
    try {
      const res = await fetch(`/api/guilds/${selectedGuildId}/auto-responses/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('Otomatik cevap silindi.');
        fetchAutoResponses(selectedGuildId);
      }
    } catch {}
  };

  // Kullanıcı Düzenle
  const handleSaveUser = async () => {
    if (!editingUser || !selectedGuildId) return;
    try {
      const res = await fetch(`/api/users/${editingUser.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: selectedGuildId,
          balance: editingUser.balance,
          bank_balance: editingUser.bank_balance,
          xp: editingUser.xp,
          level: editingUser.level,
          warnings: editingUser.warnings
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Kullanıcı verileri güncellendi!');
        setEditingUser(null);
        fetchUsers();
      }
    } catch {
      showToast('Güncelleme hatası', 'error');
    }
  };

  // Global Bot Ayarlarını Kaydet
  const handleSaveBotSettings = async () => {
    try {
      const res = await fetch('/api/bot/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prefix: botPrefix,
          language: botLang,
          autoDeleteSeconds: Number(botAutoDelete),
          maintenanceMode: botMaintenance,
          ownerId: botOwnerId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Global bot ayarları başarıyla kaydedildi!');
      }
    } catch {
      showToast('Ayarlar kaydedilemedi', 'error');
    }
  };

  // Uptime formatlama
  const formatLiveUptime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours}sa ${minutes}dk ${seconds}sn`;
  };

  // Filtrelenmiş Loglar
  const filteredLogs = logs.filter(l => {
    if (logFilter !== 'all' && l.type !== logFilter) return false;
    if (logSearch) {
      const s = logSearch.toLowerCase();
      return l.message.toLowerCase().includes(s) || l.tag.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0F0C1B] text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans transition-colors duration-200`}>
      {/* Toast Bildirisi */}
      {actionMsg && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all ${
          actionMsg.type === 'success' ? 'bg-emerald-600/90 text-white border border-emerald-400/30' : 'bg-rose-600/90 text-white border border-rose-400/30'
        }`}>
          {actionMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{actionMsg.text}</span>
        </div>
      )}

      {!dashboardToken && (
        <div className="fixed inset-x-0 top-0 z-40 flex justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl border border-violet-500/40 bg-slate-950/80 p-4 shadow-2xl shadow-violet-950/35 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Dashboard access</p>
                <h2 className="text-lg font-semibold text-white">Admin token required</h2>
              </div>
              <Key className="h-5 w-5 text-violet-300" />
            </div>
            <div className="flex gap-2">
              <input
                value={dashboardToken}
                onChange={e => setDashboardToken(e.target.value)}
                type="password"
                placeholder="Enter DASHBOARD_API_TOKEN"
                className="flex-1 rounded-xl border border-violet-500/30 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-400"
              />
              <button
                onClick={() => saveDashboardToken(dashboardToken)}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ana Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* SOL MENÜ (SIDEBAR) */}
        <aside className={`w-72 flex-shrink-0 flex flex-col border-r ${darkMode ? 'bg-[#151128]/95 border-purple-900/30' : 'bg-white border-slate-200'} backdrop-blur-xl z-20`}>
          {/* Logo & Başlık */}
          <div className="p-5 border-b border-purple-900/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8E44AD] to-[#9B59B6] flex items-center justify-center shadow-lg shadow-purple-900/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-purple-300 via-purple-100 to-white bg-clip-text text-transparent">
                  VEGA PANEL
                </h1>
                <p className="text-xs text-purple-400 font-medium">v14.0 Ultimate Edition</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title={darkMode ? 'Açık Mod' : 'Karanlık Mod'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Menü Öğeleri (Scrollable) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-purple-400/70 uppercase">Genel Bakış</div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('bot-control')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'bot-control'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Bot Kontrolü & Mesaj</span>
            </button>

            <button
              onClick={() => setActiveTab('presence')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'presence'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Bot Durumu & Önizleme</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Detaylı İstatistikler</span>
            </button>

            <div className="pt-3 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-purple-400/70 uppercase">Sunucu & Yönetim</div>
            <button
              onClick={() => setActiveTab('guilds')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'guilds'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Sunucu Listesi ({guilds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guild-settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'guild-settings'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Sunucu Ayarları</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Güvenlik & Koruma</span>
            </button>

            <button
              onClick={() => setActiveTab('auto-responses')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'auto-responses'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Otomatik Cevaplar</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kullanıcı Yönetimi</span>
            </button>

            <div className="pt-3 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-purple-400/70 uppercase">Sistem & Konsol</div>
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'logs'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Canlı Log Akışı</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'database'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Veritabanı Yönetimi</span>
            </button>

            <button
              onClick={() => setActiveTab('bot-settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'bot-settings'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Bot Ayarları & Bakım</span>
            </button>

            <button
              onClick={() => setActiveTab('commands')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'commands'
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] text-white shadow-md shadow-purple-900/40'
                  : darkMode ? 'text-slate-300 hover:bg-purple-950/40 hover:text-white' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Komut Rehberi (100+)</span>
            </button>
          </nav>

          {/* Alt Durum Çubuğu */}
          <div className={`p-4 border-t ${darkMode ? 'border-purple-900/20 bg-purple-950/20' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${botStatus?.running ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{botStatus?.botTag || 'Vega Bot'}</p>
                <p className="text-[11px] text-purple-400 truncate">{botStatus?.running ? '7/24 Aktif & Çevrimiçi' : 'Çevrimdışı'}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300">
                {botStatus?.ping || 0}ms
              </span>
            </div>
          </div>
        </aside>

        {/* SAĞ ANA İÇERİK ALANI */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
          {/* Üst Header */}
          <header className={`sticky top-0 z-10 px-8 py-4 border-b flex items-center justify-between backdrop-blur-xl ${
            darkMode ? 'bg-[#0F0C1B]/80 border-purple-900/20' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold tracking-tight">
                {activeTab === 'dashboard' && '📊 Dashboard (Ana Sayfa)'}
                {activeTab === 'bot-control' && '🤖 Bot Kontrolü & Mesaj Yönetimi'}
                {activeTab === 'presence' && '🎭 Gelişmiş Bot Durumu & Canlı Önizleme'}
                {activeTab === 'stats' && '📈 Detaylı Performans & Kullanım İstatistikleri'}
                {activeTab === 'guilds' && '🏰 Bağlı Sunucular'}
                {activeTab === 'guild-settings' && '⚙️ Sunucu Ayarları Yönetimi'}
                {activeTab === 'security' && '🛡️ Güvenlik & Koruma Merkezi'}
                {activeTab === 'auto-responses' && '💬 Otomatik Cevap Sistemi'}
                {activeTab === 'users' && '👥 Kullanıcı Yönetimi & Sicil'}
                {activeTab === 'logs' && '📝 Canlı Konsol Log Akışı'}
                {activeTab === 'database' && '🗄️ SQLite Veritabanı Yönetimi & İndirme'}
                {activeTab === 'bot-settings' && '🔧 Global Bot Ayarları & Bakım'}
                {activeTab === 'commands' && '📖 Komut Kataloğu & Parametreler'}
              </h2>
            </div>

            {/* Hızlı Sunucu Seçici & İndirme */}
            <div className="flex items-center gap-3">
              {guilds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-purple-400 font-medium">Sunucu:</span>
                  <select
                    value={selectedGuildId}
                    onChange={e => setSelectedGuildId(e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      darkMode ? 'bg-[#151128] border-purple-900/40 text-purple-200' : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    {guilds.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.memberCount} üye)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <a
                href="/api/download-zip"
                download
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ZIP İndir</span>
              </a>
            </div>
          </header>

          {/* İÇERİK BÖLÜMLERİ */}
          <div className="p-8 space-y-8">
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* 4 Ana Özet Kartı */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Sunucu Sayısı</span>
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                        <Server className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-black">{botStatus?.guildsCount || 0}</div>
                      <p className="text-xs text-slate-400 mt-0.5">Aktif bağlı Discord sunucusu</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Toplam Kullanıcı</span>
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-black">{botStatus?.usersCount?.toLocaleString('tr-TR') || 0}</div>
                      <p className="text-xs text-slate-400 mt-0.5">Erişilebilir toplam üye</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">7/24 Kesintisiz Uptime</span>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-black font-mono">{formatLiveUptime(liveSeconds)}</div>
                      <p className="text-xs text-emerald-400 mt-0.5">🟢 Canlı sayaç işliyor</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">WebSocket Ping</span>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                        <Radio className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-black font-mono">{botStatus?.ping || 0} ms</div>
                      <p className="text-xs text-slate-400 mt-0.5">Discord API bağlantı gecikmesi</p>
                    </div>
                  </div>
                </div>

                {/* 24 Saatlik Performans Grafiği */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Canlı Performans & Aktivite Analizi (Bellek ve Ping)</span>
                  </h3>
                  <PerformanceMetricsChart
                    currentPing={botStatus?.ping || 0}
                    currentMemory={botStatus?.memoryMB || 0}
                    isBotRunning={botStatus?.running || false}
                  />
                </div>

                {/* En Çok Kullanılan 5 Komut & Son 10 Log */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top 5 Komut */}
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>En Çok Kullanılan 5 Komut</span>
                    </h3>
                    <div className="space-y-3">
                      {topCommands.length > 0 ? (
                        topCommands.slice(0, 5).map((cmd, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-900/20">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold font-mono">
                                #{idx + 1}
                              </span>
                              <span className="font-mono text-sm font-semibold">/{cmd.command}</span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                              {cmd.count} kez
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">Henüz komut kullanım kaydı bulunmuyor.</p>
                      )}
                    </div>
                  </div>

                  {/* Son Log Kayıtları */}
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Son Canlı Konsol Logları</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('logs')}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Tümünü Gör →
                      </button>
                    </div>
                    <div className="space-y-2 font-mono text-xs max-h-56 overflow-y-auto custom-scrollbar">
                      {logs.slice(-6).map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded bg-black/40 border border-purple-900/20">
                          <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                            log.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                            log.type === 'error' ? 'bg-rose-500/20 text-rose-300' :
                            log.type === 'warn' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                          }`}>[{log.tag}]</span>
                          <span className="text-slate-300 truncate">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOT KONTROLÜ */}
            {activeTab === 'bot-control' && (
              <div className="space-y-8">
                {/* Başlat / Durdur / Restart Butonları */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Bot Çalışma Yönetimi</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      disabled={actionLoading || botStatus?.running}
                      onClick={() => handleBotAction('start')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium shadow-lg shadow-emerald-900/30 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      <span>Botu Başlat</span>
                    </button>

                    <button
                      disabled={actionLoading || !botStatus?.running}
                      onClick={() => handleBotAction('stop')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium shadow-lg shadow-rose-900/30 transition-all"
                    >
                      <Square className="w-4 h-4" />
                      <span>Botu Durdur</span>
                    </button>

                    <button
                      disabled={actionLoading}
                      onClick={() => handleBotAction('restart')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium shadow-lg shadow-purple-900/30 transition-all"
                    >
                      <RotateCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                      <span>Yeniden Başlat</span>
                    </button>
                  </div>
                </div>

                {/* Bot Ağzından Mesaj Gönderme */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Normal Mesaj */}
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Send className="w-4 h-4 text-purple-400" />
                      <span>Bot Ağzından Düz Mesaj Gönder</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-purple-300 block mb-1.5">Hedef Kanal ID veya Kanal Seçimi</label>
                        {guildDetails?.channels && guildDetails.channels.length > 0 ? (
                          <select
                            value={msgChannelId}
                            onChange={e => setMsgChannelId(e.target.value)}
                            className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                            }`}
                          >
                            <option value="">-- Kanal Seçin --</option>
                            {guildDetails.channels.map((c: any) => (
                              <option key={c.id} value={c.id}>#{c.name} ({c.id})</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder="Örn: 123456789012345678"
                            value={msgChannelId}
                            onChange={e => setMsgChannelId(e.target.value)}
                            className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                            }`}
                          />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-purple-300 block mb-1.5">Mesaj İçeriği</label>
                        <textarea
                          rows={4}
                          placeholder="Botun göndermesini istediğiniz mesaj..."
                          value={msgContent}
                          onChange={e => setMsgContent(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>

                      <button
                        onClick={handleSendMessage}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-md shadow-purple-900/30"
                      >
                        Mesajı Gönder
                      </button>
                    </div>
                  </div>

                  {/* Embed Duyuru */}
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Şık Embed Duyuru Gönder</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-purple-300 block mb-1.5">Duyuru Başlığı</label>
                        <input
                          type="text"
                          placeholder="Örn: 📢 BÜYÜK ETKİNLİK DUYURUSU"
                          value={embedTitle}
                          onChange={e => setEmbedTitle(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-purple-300 block mb-1.5">Duyuru Açıklaması</label>
                        <textarea
                          rows={3}
                          placeholder="Duyuru detayları, kurallar veya etkinlik bilgisi..."
                          value={embedDesc}
                          onChange={e => setEmbedDesc(e.target.value)}
                          className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-purple-300 block mb-1.5">Embed Rengi</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={embedColor}
                            onChange={e => setEmbedColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                          />
                          <span className="text-xs font-mono font-bold">{embedColor}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleSendEmbed}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md shadow-purple-900/30"
                      >
                        Embed Duyurusunu Yayınla
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BOT DURUMU (GELİŞMİŞ & CANLI ÖNİZLEME) */}
            {activeTab === 'presence' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Durum Ayarlama Formu */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-5`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-400" />
                    <span>Bot Custom Durumunu Ayarla</span>
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1.5">Aktivite Türü</label>
                    <select
                      value={presenceType}
                      onChange={e => setPresenceType(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      <option value="PLAYING">🎮 Oynuyor (Playing)</option>
                      <option value="WATCHING">📺 İzliyor (Watching)</option>
                      <option value="LISTENING">🎵 Dinliyor (Listening)</option>
                      <option value="STREAMING">🟣 Yayında (Streaming)</option>
                      <option value="COMPETING">🏆 Yarışıyor (Competing)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1.5">Durum Yazısı (Metin)</label>
                    <input
                      type="text"
                      placeholder="Örn: /yardım | v14.0 | Vega Asistan"
                      value={presenceText}
                      onChange={e => setPresenceText(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>

                  {presenceType === 'STREAMING' && (
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">Yayın URL (Twitch veya YouTube)</label>
                      <input
                        type="text"
                        placeholder="https://twitch.tv/vega"
                        value={streamingUrl}
                        onChange={e => setStreamingUrl(e.target.value)}
                        className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-purple-300 block mb-1.5">Çevrimiçi Durum Modu</label>
                    <select
                      value={presenceStatus}
                      onChange={e => setPresenceStatus(e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    >
                      <option value="online">🟢 Çevrimiçi (Online)</option>
                      <option value="idle">🟡 Boşta (Idle)</option>
                      <option value="dnd">🔴 Rahatsız Etmeyin (Do Not Disturb)</option>
                      <option value="invisible">⚪ Görünmez (Invisible)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSavePresence}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md shadow-purple-900/30"
                  >
                    Durumu Anında Değiştir
                  </button>
                </div>

                {/* CANLI DİSCORD PROFİL ÖNİZLEME KARTI */}
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span>Canlı Discord Önizlemesi</span>
                    </h3>

                    <div className="p-5 rounded-2xl bg-[#2B2D31] text-white max-w-sm mx-auto shadow-2xl border border-white/5">
                      <div className="relative mb-4">
                        <div className="h-16 rounded-t-xl bg-gradient-to-r from-[#9B59B6] to-[#6C3483]" />
                        <div className="absolute -bottom-6 left-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-[#1E1F22] p-1">
                              <div className="w-full h-full rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                                {botStatus?.avatar ? (
                                  <img src={botStatus.avatar} alt="Bot Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  'V'
                                )}
                              </div>
                            </div>
                            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#2B2D31] ${
                              presenceStatus === 'online' ? 'bg-emerald-500' :
                              presenceStatus === 'idle' ? 'bg-amber-500' :
                              presenceStatus === 'dnd' ? 'bg-rose-500' : 'bg-slate-400'
                            }`} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 px-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-base">{botStatus?.botTag?.split('#')[0] || 'Vega'}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#5865F2] text-white">BOT</span>
                          </div>
                          <span className="text-xs text-slate-400">vega_bot#0000</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#1E1F22] space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktivite</p>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="font-bold text-purple-300">
                              {presenceType === 'PLAYING' && 'Oynuyor:'}
                              {presenceType === 'WATCHING' && 'İzliyor:'}
                              {presenceType === 'LISTENING' && 'Dinliyor:'}
                              {presenceType === 'STREAMING' && 'Yayında:'}
                              {presenceType === 'COMPETING' && 'Yarışıyor:'}
                            </span>
                            <span className="text-slate-200">{presenceText}</span>
                          </div>
                          {presenceType === 'STREAMING' && (
                            <p className="text-[10px] text-purple-400 truncate">{streamingUrl}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Durum Geçmişi */}
                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">Son Durum Geçmişi</h4>
                    <div className="space-y-2 text-xs">
                      {presenceHistory.map((h, i) => (
                        <div key={i} className="p-2 rounded-lg bg-purple-950/30 flex items-center justify-between border border-purple-900/20">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-200 font-bold text-[10px]">{h.activity_type}</span>
                            <span className="font-medium text-slate-300">{h.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{h.applied_at?.slice(11, 16)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DETAYLI İSTATİSTİKLER */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Canlı Uptime</h4>
                    <div className="text-3xl font-black font-mono text-emerald-400">{formatLiveUptime(liveSeconds)}</div>
                    <p className="text-xs text-slate-400 mt-1">Kesintisiz 7/24 çalışma süresi</p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">RAM / Bellek Kullanımı</h4>
                    <div className="text-3xl font-black font-mono text-purple-400">{botStatus?.memoryMB || 0} MB</div>
                    <p className="text-xs text-slate-400 mt-1">Node.js heap bellek tüketimi</p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Kayıtlı Komut Sayısı</h4>
                    <div className="text-3xl font-black font-mono text-indigo-400">{botStatus?.totalCommands || 100}+</div>
                    <p className="text-xs text-slate-400 mt-1">18 kategoride tam entegre</p>
                  </div>
                </div>

                {/* Kategori Bazlı Dağılım */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Kategori Bazlı Komut Dağılımı</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.entries(categoryStats).map(([cat, count]) => (
                      <div key={cat} className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-between">
                        <span className="text-xs font-semibold">{cat}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold font-mono">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. SUNUCU LİSTESİ */}
            {activeTab === 'guilds' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guilds.map(g => (
                    <div
                      key={g.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        selectedGuildId === g.id
                          ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-950/30'
                          : darkMode ? 'bg-[#151128]/80 border-purple-900/30 hover:border-purple-500/50' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center font-bold text-lg overflow-hidden">
                          {g.icon ? (
                            <img src={g.icon} alt={g.name} className="w-full h-full object-cover" />
                          ) : (
                            g.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base truncate">{g.name}</h4>
                          <p className="text-xs text-purple-400 font-mono mt-0.5">ID: {g.id}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{g.memberCount} Üye</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-purple-900/20 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedGuildId(g.id);
                            setActiveTab('guild-settings');
                          }}
                          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Ayarları Düzenle</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGuildId(g.id);
                            setActiveTab('security');
                          }}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Güvenlik</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SUNUCU AYARLARI */}
            {activeTab === 'guild-settings' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
                  <div className="flex items-center justify-between pb-4 border-b border-purple-900/20">
                    <div>
                      <h3 className="text-lg font-bold">Sunucu Yapılandırma Menüsü</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Seçili Sunucu: {guildDetails?.guild?.name || selectedGuildId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                      Canlı Senkronizasyon
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hoş Geldin Kanalı */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">Hoş Geldin Kanalı</label>
                      <input
                        type="text"
                        placeholder="Kanal ID"
                        defaultValue={guildDetails?.config?.welcome_channel || ''}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Veda Kanalı */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">Veda / Ayrılma Kanalı</label>
                      <input
                        type="text"
                        placeholder="Kanal ID"
                        defaultValue={guildDetails?.config?.leave_channel || ''}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Seviye Kanalı */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">Seviye Atlama Duyuru Kanalı</label>
                      <input
                        type="text"
                        placeholder="Kanal ID (Boşsa aynı kanala atar)"
                        defaultValue={guildDetails?.config?.level_channel || ''}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* AI Sohbet Kanalı */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">AI Sohbet Özel Kanalı</label>
                      <input
                        type="text"
                        placeholder="Kanal ID"
                        defaultValue={guildDetails?.config?.ai_chat_channel || ''}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* AI Sağlayıcı Seçimi */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">AI Sağlayıcı Modeli</label>
                      <select
                        defaultValue={guildDetails?.config?.ai_provider || 'auto'}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      >
                        <option value="auto">Otomatik (5 Aşamalı Fallback Zinciri)</option>
                        <option value="gemini">Google Gemini (3.8/2.5 Flash)</option>
                        <option value="groq">Groq (Llama-3.3 70B Versatile)</option>
                        <option value="openrouter">OpenRouter (Llama 3.1 8B)</option>
                      </select>
                    </div>

                    {/* Yetkili Rolü */}
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1.5">Yetkili / Moderatör Rol ID</label>
                      <input
                        type="text"
                        placeholder="Rol ID"
                        defaultValue={guildDetails?.config?.staff_role || ''}
                        className={`w-full p-2.5 rounded-xl text-sm border ${
                          darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 6 Log Kanalı */}
                  <div className="pt-4 border-t border-purple-900/20">
                    <h4 className="text-sm font-bold text-purple-300 mb-4">6 Farklı Log Kanalı Yapılandırması</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Moderatör Log (Ban/Kick/Mute)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.mod_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Mesaj Log (Silme/Düzenleme)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.mesaj_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Ses Log (Katılma/Ayrılma)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.ses_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Üye Log (Giriş/Çıkış)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.uye_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Rol Log (Oluşturma/Silme)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.rol_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Kanal Log (Oluşturma/Silme)</label>
                        <input
                          type="text"
                          placeholder="Kanal ID"
                          defaultValue={guildDetails?.config?.kanal_log_channel || ''}
                          className={`w-full p-2 rounded-lg text-xs border ${
                            darkMode ? 'bg-[#0F0C1B] border-purple-900/40 text-white' : 'bg-white border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GÜVENLİK & KORUMA */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-6`}>
                  <div className="flex items-center justify-between pb-4 border-b border-purple-900/20">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <span>Detaylı Sunucu Koruma & Güvenlik Parametreleri</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Anti-Spam, Anti-Link, Anti-Caps, Küfür ve Raid Sınırları</p>
                    </div>
                    <button
                      onClick={handleSaveSecurity}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-900/30 transition-all text-xs"
                    >
                      Ayarları Kaydet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Anti-Spam */}
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Anti-Spam Limiti</span>
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Maksimum Mesaj Sayısı</label>
                        <input
                          type="number"
                          value={secSpamLimitMsg}
                          onChange={e => setSecSpamLimitMsg(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Zaman Aralığı (Saniye)</label>
                        <input
                          type="number"
                          value={secSpamLimitSec}
                          onChange={e => setSecSpamLimitSec(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                    </div>

                    {/* Anti-Caps */}
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Anti-Caps Limiti</span>
                        <Volume2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Maksimum Büyük Harf Yüzdesi (%)</label>
                        <input
                          type="number"
                          min="30"
                          max="100"
                          value={secCapsPercent}
                          onChange={e => setSecCapsPercent(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Mesajdaki harflerin %{secCapsPercent}'si büyükse mesaj silinir.</p>
                    </div>

                    {/* Anti-Raid */}
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Anti-Raid Koruma</span>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Maksimum Üye Girişi</label>
                        <input
                          type="number"
                          value={secRaidJoins}
                          onChange={e => setSecRaidJoins(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Süre (Saniye)</label>
                        <input
                          type="number"
                          value={secRaidSec}
                          onChange={e => setSecRaidSec(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Otomatik kilit süresi (Dakika, 1–120)</label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          step="1"
                          value={secRaidLockDuration}
                          onChange={e => setSecRaidLockDuration(Number(e.target.value))}
                          className="w-full p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Özel Yasaklı Kelimeler & Domainler */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-purple-900/20">
                    {/* Küfür Listesi */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                        Özel Yasaklı Kelimeler Listesi ({secBadWordsList.length})
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Yasaklanacak kelime..."
                          value={secBadWordsInput}
                          onChange={e => setSecBadWordsInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && secBadWordsInput.trim()) {
                              setSecBadWordsList([...secBadWordsList, secBadWordsInput.trim().toLowerCase()]);
                              setSecBadWordsInput('');
                            }
                          }}
                          className="flex-1 p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                        <button
                          onClick={() => {
                            if (secBadWordsInput.trim()) {
                              setSecBadWordsList([...secBadWordsList, secBadWordsInput.trim().toLowerCase()]);
                              setSecBadWordsInput('');
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold"
                        >
                          Ekle
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-2 rounded-lg bg-black/30 border border-purple-900/20">
                        {secBadWordsList.map((w, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[11px] flex items-center gap-1">
                            {w}
                            <button
                              onClick={() => setSecBadWordsList(secBadWordsList.filter((_, i) => i !== idx))}
                              className="hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Yasaklı Linkler / Domainler */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                        Özel Yasaklı Linkler & Domainler ({secBannedDomainsList.length})
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Örn: bit.ly, zararlisite.com"
                          value={secBannedDomainsInput}
                          onChange={e => setSecBannedDomainsInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && secBannedDomainsInput.trim()) {
                              setSecBannedDomainsList([...secBannedDomainsList, secBannedDomainsInput.trim().toLowerCase()]);
                              setSecBannedDomainsInput('');
                            }
                          }}
                          className="flex-1 p-2 rounded-lg text-xs bg-black/40 border border-purple-900/30"
                        />
                        <button
                          onClick={() => {
                            if (secBannedDomainsInput.trim()) {
                              setSecBannedDomainsList([...secBannedDomainsList, secBannedDomainsInput.trim().toLowerCase()]);
                              setSecBannedDomainsInput('');
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold"
                        >
                          Ekle
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-2 rounded-lg bg-black/30 border border-purple-900/20">
                        {secBannedDomainsList.map((d, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1">
                            {d}
                            <button
                              onClick={() => setSecBannedDomainsList(secBannedDomainsList.filter((_, i) => i !== idx))}
                              className="hover:text-white"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. OTOMATİK CEVAPLAR */}
            {activeTab === 'auto-responses' && (
              <div className="space-y-6">
                {/* Yeni Ekle Formu */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>Yeni Otomatik Cevap Tetikleyicisi Ekle</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Tetikleyici Kelime / Cümle</label>
                      <input
                        type="text"
                        placeholder="Örn: selam"
                        value={newArTrigger}
                        onChange={e => setNewArTrigger(e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Botun Vereceği Cevap</label>
                      <input
                        type="text"
                        placeholder="Örn: Aleyküm selam, hoş geldin!"
                        value={newArResponse}
                        onChange={e => setNewArResponse(e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Eşleşme Türü</label>
                      <select
                        value={newArMatchType}
                        onChange={e => setNewArMatchType(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30 text-white"
                      >
                        <option value="contains">İçeriyorsa (Contains)</option>
                        <option value="exact">Tam Eşleşme (Exact)</option>
                        <option value="startsWith">İle Başlıyorsa (Starts With)</option>
                        <option value="endsWith">İle Bitiyorsa (Ends With)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddAutoResponse}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-900/30 transition-all"
                      >
                        Tetikleyiciyi Ekle
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mevcut Cevaplar Tablosu */}
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-sm font-bold text-purple-300 mb-4">Sunucuda Kayıtlı Otomatik Cevaplar ({autoResponses.length})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-purple-900/20 text-purple-400 font-semibold">
                          <th className="p-3">ID</th>
                          <th className="p-3">Tetikleyici</th>
                          <th className="p-3">Bot Yanıtı</th>
                          <th className="p-3">Eşleşme</th>
                          <th className="p-3 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {autoResponses.map(ar => (
                          <tr key={ar.id} className="border-b border-purple-900/10 hover:bg-purple-950/20">
                            <td className="p-3 font-mono text-slate-500">#{ar.id}</td>
                            <td className="p-3 font-semibold text-purple-200">{ar.trigger}</td>
                            <td className="p-3 text-slate-300">{ar.response}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 text-[10px] font-mono">
                                {ar.match_type}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteAutoResponse(ar.id)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 9. KULLANICI YÖNETİMİ */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>Kullanıcı Profilleri, Seviye & Bakiye Düzenleme</span>
                    </h3>
                    <div className="w-64">
                      <input
                        type="text"
                        placeholder="Kullanıcı ID Ara..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchUsers()}
                        className="w-full p-2 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-purple-900/20 text-purple-400 font-semibold">
                          <th className="p-3">Kullanıcı ID</th>
                          <th className="p-3">Seviye (Level)</th>
                          <th className="p-3">XP Puanı</th>
                          <th className="p-3">Bakiye (Coin)</th>
                          <th className="p-3">Banka</th>
                          <th className="p-3">Uyarı</th>
                          <th className="p-3 text-right">Düzenle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map(u => (
                          <tr key={u.id} className="border-b border-purple-900/10 hover:bg-purple-950/20">
                            <td className="p-3 font-mono font-bold text-purple-200">{u.id}</td>
                            <td className="p-3 font-mono font-bold text-amber-300">Lvl {u.level}</td>
                            <td className="p-3 font-mono text-slate-400">{u.xp} XP</td>
                            <td className="p-3 font-mono text-emerald-400">{u.balance} 🪙</td>
                            <td className="p-3 font-mono text-slate-300">{u.bank_balance || 0} 🏦</td>
                            <td className="p-3 font-mono text-rose-400">{u.warnings} ⚠️</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setEditingUser({ ...u })}
                                className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 font-semibold text-[11px]"
                              >
                                Düzenle
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Kullanıcı Düzenleme Modalı */}
                {editingUser && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`w-full max-w-md p-6 rounded-2xl border ${darkMode ? 'bg-[#151128] border-purple-900/40 text-white' : 'bg-white border-slate-200 text-slate-800'} space-y-4 shadow-2xl`}>
                      <h4 className="text-base font-bold">Kullanıcı İstatistiklerini Düzenle: {editingUser.id}</h4>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-slate-400 block mb-1">Seviye (Level)</label>
                          <input
                            type="number"
                            value={editingUser.level}
                            onChange={e => setEditingUser({ ...editingUser, level: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg bg-black/40 border border-purple-900/30"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">XP</label>
                          <input
                            type="number"
                            value={editingUser.xp}
                            onChange={e => setEditingUser({ ...editingUser, xp: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg bg-black/40 border border-purple-900/30"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Cüzdan Bakiyesi</label>
                          <input
                            type="number"
                            value={editingUser.balance}
                            onChange={e => setEditingUser({ ...editingUser, balance: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg bg-black/40 border border-purple-900/30"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Banka Bakiyesi</label>
                          <input
                            type="number"
                            value={editingUser.bank_balance || 0}
                            onChange={e => setEditingUser({ ...editingUser, bank_balance: Number(e.target.value) })}
                            className="w-full p-2 rounded-lg bg-black/40 border border-purple-900/30"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSaveUser}
                          className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 rounded-xl bg-slate-700 text-white text-xs"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 10. CANLI LOG AKIŞI */}
            {activeTab === 'logs' && (
              <div className="space-y-4">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Filtre Butonları */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-purple-900/20 text-xs">
                      {(['all', 'info', 'success', 'warn', 'error'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setLogFilter(f)}
                          className={`px-3 py-1.5 rounded-lg uppercase font-bold text-[11px] transition-all ${
                            logFilter === f ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Log ara..."
                        value={logSearch}
                        onChange={e => setLogSearch(e.target.value)}
                        className="p-2 rounded-xl text-xs bg-black/40 border border-purple-900/30 w-48"
                      />
                      <button
                        onClick={() => fetch('/api/bot/logs/clear', { method: 'POST' }).then(() => fetchLogs())}
                        className="px-3 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Temizle</span>
                      </button>
                    </div>
                  </div>

                  {/* Log Konsolu */}
                  <div className="p-4 rounded-xl bg-black/60 border border-purple-900/30 font-mono text-xs max-h-[500px] overflow-y-auto space-y-1.5 custom-scrollbar">
                    {filteredLogs.map((l, i) => (
                      <div key={i} className="flex items-start gap-2.5 py-0.5 leading-relaxed">
                        <span className="text-slate-500 select-none text-[11px]">{l.timestamp}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                          l.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
                          l.type === 'error' ? 'bg-rose-500/20 text-rose-300' :
                          l.type === 'warn' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          [{l.tag}]
                        </span>
                        <span className={`break-all ${
                          l.type === 'error' ? 'text-rose-200' :
                          l.type === 'warn' ? 'text-amber-200' :
                          l.type === 'success' ? 'text-emerald-200' : 'text-slate-300'
                        }`}>
                          {l.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 11. VERİTABANI YÖNETİMİ */}
            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="text-base font-bold">SQLite Veritabanı Tablo Gezgini</h3>
                        <p className="text-xs text-slate-400">Tüm bot tablolarını görüntüleyin ve veritabanını indirin</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href="/api/db/download-db"
                        download
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-900/30"
                      >
                        <Download className="w-4 h-4" />
                        <span>vega.sqlite İndir</span>
                      </a>
                      <button
                        onClick={() => fetch('/api/db/backup', { method: 'POST' }).then(() => showToast('Veritabanı yedeği alındı!'))}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                      >
                        <FolderArchive className="w-4 h-4" />
                        <span>Yedek Al</span>
                      </button>
                    </div>
                  </div>

                  {/* Tablo Seçici Butonlar */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {dbTables.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedDbTable(t)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                          selectedDbTable === t
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                            : 'bg-black/30 text-slate-400 hover:text-white border border-purple-900/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Tablo İçeriği */}
                  <div className="overflow-x-auto max-h-96 custom-scrollbar border border-purple-900/20 rounded-xl">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-purple-950/40 sticky top-0">
                        <tr className="border-b border-purple-900/30 text-purple-300">
                          {tableData.columns.map(c => (
                            <th key={c} className="p-3">{c}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-purple-900/10 hover:bg-purple-950/20">
                            {tableData.columns.map(c => (
                              <td key={c} className="p-3 text-slate-300 truncate max-w-xs">
                                {typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 12. GLOBAL BOT AYARLARI */}
            {activeTab === 'bot-settings' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-6 max-w-2xl`}>
                  <div className="flex items-center justify-between pb-4 border-b border-purple-900/20">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span>Global Bot & Sistem Ayarları</span>
                    </h3>
                    <button
                      onClick={handleSaveBotSettings}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-900/30"
                    >
                      Ayarları Kaydet
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1">Varsayılan Komut Prefix'i</label>
                      <input
                        type="text"
                        value={botPrefix}
                        onChange={e => setBotPrefix(e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1">Varsayılan Sistem Dili</label>
                      <select
                        value={botLang}
                        onChange={e => setBotLang(e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30 text-white"
                      >
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇬🇧 English</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1">Otomatik Mesaj Silme Süresi (Saniye)</label>
                      <input
                        type="number"
                        value={botAutoDelete}
                        onChange={e => setBotAutoDelete(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-purple-300 block mb-1">Bot Sahibi Discord ID</label>
                      <input
                        type="text"
                        placeholder="Örn: 123456789012345678"
                        value={botOwnerId}
                        onChange={e => setBotOwnerId(e.target.value)}
                        className="w-full p-2.5 rounded-xl text-xs bg-black/40 border border-purple-900/30"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">Yeni sunucu bildirimleri bu ID'ye DM olarak iletilir.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/30 border border-purple-900/30">
                      <div>
                        <span className="font-bold text-sm block">Bakım Modu (Maintenance Mode)</span>
                        <p className="text-xs text-slate-400">Aktifken sadece bot sahibi komutları çalıştırabilir.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={botMaintenance}
                        onChange={e => setBotMaintenance(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 13. KOMUT REHBERİ */}
            {activeTab === 'commands' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#151128]/80 border-purple-900/30' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Tüm Komutlar ve Kullanım Rehberi ({botStatus?.totalCommands || 100}+ Komut)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/yardim</span>
                      <p className="text-xs text-slate-400 mt-1">Tüm 18 kategoriyi butonlu ve interaktif listeler.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/panel</span>
                      <p className="text-xs text-slate-400 mt-1">Discord üzerinden kapsamlı sunucu yönetim panelini açar.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/sohbet</span>
                      <p className="text-xs text-slate-400 mt-1">5 aşamalı fallback ve hafızalı Türkçe AI ile sohbet edin.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/oynat [şarkı]</span>
                      <p className="text-xs text-slate-400 mt-1">YouTube ve Spotify müziklerini 7/24 seste çalar.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/ses-247 ayarla</span>
                      <p className="text-xs text-slate-400 mt-1">Botu belirtilen ses kanalında 7/24 kesintisiz tutar.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-xs font-bold text-purple-300">/evlen [@kullanıcı] [yuva]</span>
                      <p className="text-xs text-slate-400 mt-1">1., 2. ve 3. eş yuvalarıyla sanal evlilik teklifi edin.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
