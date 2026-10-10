# 🌌 Vega Discord Bot - Faz 17 (Prefix Komut Sistemi & Kapsamlı Hata Düzeltmeleri)

<div align="center">
  <img src="https://cdn.discordapp.com/embed/avatars/0.png" width="120" height="120" style="border-radius: 50%;" />
  <h3>Türkiye'nin En Kapsamlı, Güçlü ve Kusursuz Discord Botu & Web Yönetim Paneli</h3>
  <p><strong>Discord.js v14.27+ (Components V2 Container/Section/TextDisplay) • Express.js • React + Vite • Tailwind CSS • SQLite (better-sqlite3) • Gemini / Groq / OpenRouter • 183 Komut (Prefix: <code>.</code> / Slash: <code>/yardim</code>)</strong></p>
</div>

---

## ⚡ Faz 17: Prefix Komut Sistemi (ÖNEMLİ)

Discord'un **100 global slash komut limiti** nedeniyle botta bulunan **183 komutun tamamı prefix sistemiyle** çalışır.

| Özellik | Değer |
| --- | --- |
| Prefix karakteri | `.` (`.env` içindeki `BOT_PREFIX` ile değiştirilebilir) |
| Prefix ile çalışan komut | **183** (tüm komutlar) |
| Slash olarak kalan komut | **`/yardim`** (tek slash komut) |
| Uyumluluk katmanı | `PrefixContext` (`src/utils/prefixHandler.ts`) |

Discord'un global uygulama komutları için **100 komut sınırı** bulunduğundan komutlar prefix sistemine taşındı. Komut adları örneklerde eski slash biçiminde görünse bile `/yardim` dışındaki komutları `.` ile çalıştırın.

### Komut sayısı ve kategoriler

Botta **183 komut** ve **15 kategori** bulunur: Genel, Bilgi, Moderasyon, Güvenlik, Seviye, Ekonomi, Eğlence, Müzik, AI, Ticket, Rol, Çekiliş, Log, Özel Komut ve Bildirim.

**Örnek kullanımlar:**

```
.yardim                 → Kategorili komut rehberi (V2 menü)
.ping                   → Gecikme ve sistem raporu
.ban @kullanıcı sebep   → Ban komutu (yetki gerekir)
.sohbet merhaba         → Yapay zeka sohbeti
.mute @üye 10m spam     → 10 dakika susturma
.anket "Soru?" A B C    → Anket başlatma
```

> ℹ️ Argümanlar mention (`@üye`, `#kanal`, `@rol`), ID, metin (tırnaklı), sayı, süre (`10m`, `2h`, `3d`) ve evet/hayır biçimlerinde kabul edilir.
> Eksik argüman verilirse bot otomatik olarak **kullanım rehberi** gönderir.

### Önemli özellikler

- **Presence Rotator:** Her 30 saniyede hem Custom Status notu hem de ayrı bir aktivite (Oynuyor, İzliyor, Dinliyor, Yayında veya Yarışıyor) birlikte değişir; sunucu/kullanıcı sayısı ve uptime gibi mevcut metriklerden yararlanır.
- **AI sağlayıcı zinciri:** Groq (birincil) → Gemini → OpenRouter; istek zaman aşımı sağlayıcı/model başına 8 saniyedir.
- **Güvenlik modülleri:** Sunucu ayarlarına göre anti-spam, anti-raid, anti-phishing, şüpheli hesap bildirimi, bot koruma ve raid alarmı.
- **Log sistemi:** Moderatör, mesaj, ses, üye, rol ve kanal olmak üzere 6 farklı log türü.

### `.env` ayarları

`.env.example` dosyasını `.env` olarak kopyalayıp kendi değerlerinizi girin. Token ve API anahtarlarını paylaşmayın veya Git deposuna eklemeyin.

| Değişken | Durum | Açıklama |
| --- | --- | --- |
| `DISCORD_TOKEN` | Zorunlu | Botun Discord'a bağlanma token'ı. |
| `CLIENT_ID` | Önerilen | Discord uygulama kimliği; davet bağlantısının oluşturulmasında kullanılır. |
| `BOT_OWNER_ID` | Yönetici özellikleri için | Bot sahibinin Discord kullanıcı ID'si. Boşsa bot-sahibi ayrıcalıkları kapalı kalır. |
| `GROQ_API_KEY` | İsteğe bağlı, önerilen | AI için birincil sağlayıcı anahtarı. |
| `GEMINI_API_KEY` | İsteğe bağlı | AI yedek sağlayıcısı. `GEMINI_MODEL` varsayılanı `gemini-3.8-flash` olur. |
| `OPENROUTER_API_KEY` | İsteğe bağlı | AI son yedek sağlayıcısı. |
| `GIPHY_API_KEY` | İsteğe bağlı | GIF komutlarında Giphy kullanımı. |
| `DASHBOARD_API_TOKEN` | İsteğe bağlı | Web panelinin korumalı API uçları. Paneli kullanıyorsanız güçlü ve gizli bir değer belirleyin. |
| `BOT_PREFIX` | İsteğe bağlı | Komut prefix'i; varsayılan `.`. |
| `GEMINI_MODEL` | İsteğe bağlı | Gemini model tercihi; varsayılan `gemini-3.8-flash`. |

> `.env.example` içinde örnek olması için Reddit OAuth alanları da bulunabilir; Reddit Data API kullanan `.meme` komutu için ayrıca Reddit tarafından verilmiş OAuth bilgileri gerekir.

### 🔑 Discord Developer Portal Ayarları (ZORUNLU)

Prefix komutlarının çalışabilmesi için **Message Content Intent** açık olmalıdır:

1. [Discord Developer Portal](https://discord.com/developers/applications) → Uygulamanız → **Bot** sekmesi.
2. **Privileged Gateway Intents** bölümünde **MESSAGE CONTENT INTENT** seçeneğini **AÇIN** ve kaydedin.
3. Aynı sayfadan **PRESENCE INTENT** ve **SERVER MEMBERS INTENT** seçeneklerini de açmanız önerilir.

Ayrıca bot yeniden başlatıldıktan sonra komutları yenilemek için:

```bash
npm run deploy:commands   # Discord'a yalnızca /yardim kaydedilir
```

---

## Windows 10/11 Kurulumu

1. Node.js 22.x sürümünü [resmi Node.js sitesinden](https://nodejs.org/) kurun.
2. Proje klasöründe terminal açıp `npm install --legacy-peer-deps` komutunu çalıştırın.
3. Yerel SQLite modülünü derlemek için `npm rebuild better-sqlite3` çalıştırın.
4. `.env.example` dosyasını `.env` olarak kopyalayın; en az `DISCORD_TOKEN` değerini, ayrıca kullanacağınız panel/özellik ayarlarını girin.
5. Hazır derlenmiş botu `node bot.js` ile başlatın. Paneli de çalıştırmak için üretim derlemesinden sonra `npm run start` kullanın.

Betikler Windows Güvenlik Duvarı'nı kapatmaz veya kural eklemez. Panel varsayılan olarak yalnızca yerel bilgisayarda dinler. Başka cihazlardan erişim gerekiyorsa, `DASHBOARD_HOST` değerini bilinçli biçimde yapılandırın ve güvenlik duvarında yalnızca gerekli ağ/port için kısıtlı bir kurala kendiniz karar verin.

## Wispbyte Kurulumu

1. [wispbyte.com](https://wispbyte.com/) üzerinde hesap açıp **Create Server → Node.js** ile sunucu oluşturun.
2. Güncel proje ZIP'ini sunucuya yükleyip çıkarın.
3. Wispbyte **Environment** bölümüne `.env` içindeki gerekli ve kullanacağınız isteğe bağlı değişkenleri ekleyin; tokenları sohbet veya herkese açık dosyalarda paylaşmayın.
4. Startup komutunu `node bot.js` olarak ayarlayın. `wispbyte.config` da Node.js `22.x` ve aynı başlangıç komutunu belirtir.
5. Sunucuyu başlatın (**Start**).

---

## 🛡️ Faz 16C3: 9 Yeni Güvenlik & Tehdit Koruma Komutu
1. **`/güvenlik-log`**: Mod-log'dan bağımsız, anti-spam, anti-link, phishing, raid ve bot saldırılarını kaydeden özel güvenlik kanalı.
2. **`/şüpheli-hesap`**: Sunucuya katılan hesap yaşı < 7 gün olan şüpheli hesapları anında tespit edip yetkililere ve güvenlik loguna bildiren alarm sistemi.
3. **`/anti-phishing`**: Sahte Discord Nitro, Steam hediye linkleri ve dolandırıcı domainleri tespit edip mesajı silen, kullanıcıyı 5 dakika susturan koruma motoru.
4. **`/güvenlik-tarama`**: Sunucudaki açık yönetici izinlerini, şüpheli botları, yetkisiz rolleri ve webhookları tarayan denetim sistemi.
5. **`/webhook-koruma`**: Sunucuda yetkisiz oluşturulan webhookları derhal silen ve kurucuya alarm ileten koruma.
6. **`/bot-koruma`**: Sunucuya izinsiz bot sokulmasını engelleyen, yetkisiz botları anında atan (Kick) ve beyaz liste destekleyen sistem.
7. **`/raid-alarm`**: 10 saniyede 5+ üye girişinde otomatik tetiklenen, kanalları kitleyen ve yetkilileri göreve çağıran acil durum alarmı.
8. **`/güvenlik-raporu`**: Son 7 günün engellenen tehdit, ban, spam, phishing ve bot istatistiklerini grafiklerle sunan rapor.
9. **`/güvenlik-ayarlar`**: Tüm güvenlik modüllerini interaktif butonlu (Açık/Kapalı) kontrol merkezinden yönetme.

---

## 🚀 Faz 16C2: 15+ Yeni Komut & Araçlar/Topluluk/Bilgi/Eğlence Geliştirmeleri
- **Bilgi:** `/wikipedia`, `/sunucu-ikon`, `/bot-info`, `/server-info`, `/tarihte-bugun`, `/atatürk`, `/deprem`
- **Topluluk:** `/duyuru`, `/etkinlik`, `/anket-gelişmiş`, `/rapor`
- **Araçlar:** `/çeviri`, `/hava`, `/hesapla`, `/qr-kod`, `/döviz`, `/şifre-oluştur`
- **Eğlence:** `/ship` (Canvas Aşk Ölçer & Kart), `/meme`, `/fıkra`, `/bilmece`, `/hizli-yaz`
- **Koruma & Müzik:** `/yasaklı-kelime`, `/beyaz-liste`, `/playlist`

---

## 🚀 Faz 16C1: Discord Components V2 Mimarisi
- `ContainerBuilder` (Mor `#9B59B6`), `SectionBuilder`, `TextDisplayBuilder`, `SeparatorBuilder` ve `ActionRowBuilder` tam desteği.
- `MessageFlags.IsComponentsV2` ile modern mobil ve masaüstü arayüzü.

---

## 🚀 Faz 16B İle Eklenen Yenilikler & Sistemler
1. **AI Kod Yazma Sınırı Düzeltmesi:**
   - 5-20 satırlık kod örnekleri, algoritma açıklamaları ve hata düzeltmeleri serbest bırakıldı.
   - Devasa projeler ve yüzlerce satırlık hazır bot istekleri için yol gösterici rehberlik modu.
2. **Yeni Komutlar:**
   - 🇹🇷 `/atatürk`: Gazi Mustafa Kemal Atatürk'ün yüksek çözünürlüklü fotoğrafları ve vecizeleri.
   - ⚡ `/hizli-yaz`: Tekli, bot yarışı, arkadaşla düello ve SQLite haftalık liderlik tablosu.
   - 🎭 `/durum-rol`: Custom status (Özel Durum) takip ve otomatik rol atama/kaldırma (`presenceUpdate`).
   - 🔊 `/konuştur`: Türkçe Google TTS ile ses kanalında metin seslendirme.
3. **Yeni Sistemler:**
   - 📊 `/istatistik-kanal-kur`: Otomatik güncellenen kilitli üye, bot, kanal, rol sayaçları.
   - 📋 `/sunucu-sablon`: Sunucu kanalları, rolleri ve ayarlarını şablon olarak kaydetme/uygulama.
   - 🛡️ `/doğrulama-kur`: Canvas tabanlı güvenlik Captcha doğrulama sistemi (3 deneme hakkı, güvenlik kilidi).
   - 🎙️ `/geçici-ses-kur` & `/geçici-oda`: Geçici özel ses kanalı oluşturucu ve oda yönetim paneli.
   - 💬 `/oto-sohbet`: Belirli aralıklarla kendiliğinden sohbet başlatan akıllı bot mesaj havuzu.

---

## 🚀 Faz 15.5 İle Eklenen Yenilikler

### 🤖 Bölüm A: Yapay Zeka Kontrol & Kanal Filtresi
1. **"Vega dur" & "Vega devam" Sistemi:**
   - **Yalnızca Bot Sahibi** (`BOT_OWNER_ID yapılandırması`) tarafından tetiklenebilir.
   - `Vega dur` yazıldığında o sunucuda yapay zeka durdurulur (`ai_paused = 1`).
   - `Vega devam` yazıldığında o sunucuda yapay zeka tekrar aktifleştirilir (`ai_paused = 0`).
   - Sunucu bazlıdır, SQLite'a kalıcı olarak kaydedilir ve yeniden başlatmalarda korunur.
   - Başka kullanıcılar yazdığında bot tamamen sessiz kalır ve tepki vermez.
2. **Kanal Filtresi Sistemi:**
   - `/ai-kanal-engelle <kanal>`: Seçilen kanalda yapay zekayı devre dışı bırakır.
   - `/ai-kanal-izin <kanal>`: Engellenen kanalın engelini kaldırır.
   - `/ai-kanal-liste`: Sunucudaki engelli kanalları listeler.
   - Engelli kanallarda bot @etiketlense bile kesinlikle cevap vermez.

### 🔮 Bölüm B: /console Komutu (Bot Sahibi Master Konsolu)
- **Yalnızca Bot Sahibi** (`BOT_OWNER_ID yapılandırması`) erişebilir; başkası yazarsa gizli (ephemeral) hata mesajı alır.
- Discord içi, butonlu, menülü ve tamamen gizli (ephemeral) Vega moru (`#9B59B6`) arayüz.
- Yönetilen Parametreler:
  - AI Aç/Kapat, AI Sağlayıcı, AI Duraklatma ("Vega dur/devam").
  - Kanal Filtresi Görüntüleme.
  - Sunucu Modülleri Özeti (Hoşgeldin, Veda, Log, Seviye, Koruma, Ticket).
  - Canlı Sistem Metrikleri (RAM, Uptime, Ping, Node.js).
  - SQLite Veritabanı Yedeği Oluşturma.
  - Bakım Modu (Aç/Kapat).
  - Sistem Hata Logları İnceleme ve Temizleme.

### 🛡️ Bölüm C & D: Kesintisiz Yanıt Garantisi & DM Hata Bildirimi
- **Sessiz Kalmama Garantisi:** Hata, zaman aşımı veya boş yanıt durumlarında kullanıcıya şık ve açıklayıcı Türkçe durum mesajları iletilir (Sessiz kalmak yasaktır).
- **DM Hata Bildirimi:** Sistemde oluşan tüm kritik/orta/küçük hatalar anında **SADECE bot sahibine** (`BOT_OWNER_ID`) kırmızı (`#E74C3C`) embed ile DM olarak gönderilir.
- **5 Dakikalık Akıllı Spam Koruması:** Aynı hata 5 dakika içinde tekrar ederse spam oluşmaması için tekilleştirilir.
- Tüm hata logları SQLite `error_logs` tablosuna kaydedilir.

### 👥 Bölüm E & F & G: Grup Sohbeti, Biçimlendirme & Özel Bilgi
- **Grup Sohbet Desteği:** Aynı kanalda birden çok kullanıcı konuştuğunda her kullanıcıyı ismiyle tanır ve "Ahmet ne dedi?" gibi sorulara geçmişe bakarak yanıt verir.
- **Doğal Emoji & Markdown:** Aşırıya kaçmayan zarif emojiler ve Discord formatında kusursuz kod blokları, kalın metinler, listeler.
- **Özel Bilgi Sistemi (Grounding):**
  - Botun kendi komut sayısı ve işlevleri (`/yardim`, `/ban` vb.).
  - Sunucu üye sayısı, kuruluş tarihi ve sunucu kuralları.
  - Kullanıcının seviyesi, XP'si ve sunucuya katılma tarihi.


---

## 🚀 Faz 14 İle Eklenen Devrimsel Özellikler

### 📊 Bölüm A: Gelişmiş Web Yönetim Paneli (13 Kapsamlı Bölüm)
1. **DASHBOARD (Ana Sayfa):**
   - Sunucu sayısı, toplam kullanıcı, 7/24 canlı uptime sayacı, WebSocket ping ve RAM metrikleri.
   - 24 saatlik bellek ve gecikme aktivite grafiği (`Recharts`).
   - En çok kullanılan 5 komut ve son canlı log kayıtları.
   - Vega moru (`#9B59B6`) ve modern glassmorphism tasarımı.
2. **BOT KONTROLÜ & MESAJ YÖNETİMİ:**
   - Botu Başlat, Durdur ve Yeniden Başlat butonları.
   - Bot ağzından metin mesajı ve renkli Embed duyurusu gönderme.
3. **GELİŞMİŞ BOT DURUMU (PRESENCE):**
   - Oynuyor (Playing), İzliyor (Watching), Dinliyor (Listening), Yayında (Streaming), Yarışıyor (Competing).
   - Çevrimiçi, Boşta, Rahatsız Etmeyin, Görünmez modları.
   - Canlı Discord profil önizleme kartı ve geçmiş durum kayıtları.
4. **DETAYLI İSTATİSTİKLER:**
   - Canlı Uptime, RAM (Heap), 18 kategorideki 100+ komutun dağılımı.
5. **SUNUCU LİSTESİ:**
   - Botun bulunduğu tüm sunucular, ikonlar, üye sayıları ve hızlı ayar butonları.
6. **SUNUCU AYARLARI:**
   - Hoş geldin, veda, seviye ve AI kanalları.
   - 6 Farklı Log kanalı (Moderatör, Mesaj, Ses, Üye, Rol, Kanal).
7. **GÜVENLİK & KORUMA MERKEZİ:**
   - Sunucuya özel Anti-Spam (mesaj/saniye sınırı).
   - Anti-Caps (% büyük harf sınırı).
   - Küfür filtresi & özel yasaklı kelimeler listesi.
   - Anti-Link & özel yasaklı domainler listesi.
   - Anti-Raid üye giriş limiti.
8. **OTOMATİK CEVAP SİSTEMİ:**
   - Sunucuya özel tetikleyici ve yanıt ekleme (tam eşleşme, içeriyorsa, ile başlıyorsa, ile bitiyorsa, Regex desteği).
9. **KULLANICI YÖNETİMİ & SİCİL:**
   - Kullanıcı arama, seviye, XP, bakiye, banka ve uyarı sayısı düzenleme.
10. **CANLI LOG AKIŞI:**
    - Gerçek zamanlı konsol logları, filtreleme (Info, Success, Warn, Error), arama ve temizleme.
11. **VERİTABANI YÖNETİMİ:**
    - SQLite Tablo Gezgini (Tüm tabloları görüntüleme).
    - `vega.sqlite` veritabanı dosyasını tek tıkla doğrudan indirme ve yedek alma.
12. **GLOBAL BOT AYARLARI & BAKIM:**
    - Prefix, dil (TR/EN), otomatik mesaj silme süresi, bakım modu ve Bot Sahibi ID ayarları.
13. **KOMUT REHBERİ:**
    - Tüm komutların parametreleri ve açıklamaları.

---

### 🛡️ Bölüm B: Bota Eklenen Yeni Özellikler
1. **Otomatik Cevap Sistemi (`auto_responses`):**
   - Sunucu üyeleri tetikleyici kelimeleri yazdığında bot anında otomatik yanıt verir.
2. **Gelişmiş Güvenlik ve Koruma Motoru (`protectionEngine`):**
   - Sunucu yapılandırmasındaki özel eşiklere göre spam, link, caps, küfür ve raid koruması uygular.
3. **Yeni Sunucu Tanıtım Mesajı (`guildCreate.ts`):**
   - Bot bir sunucuya katıldığında sistem kanalına 1 kez Vega moru şık tanıtım mesajı iletir.
4. **Bot Sahibi Bildirimi:**
   - Bot yeni sunucuya eklendiğinde yapılandırılmış bot sahibine sunucu bilgileri ve davet linkiyle DM gönderir.
   - Üyelere otomatik yönetici rolü verilmez; sunucu yetkileri Discord yöneticileri tarafından yönetilir.

---

### 🧠 Bölüm C: Akıllı & Hafızalı AI Motoru (`geminiChat.ts`)
1. **10 Mesajlık Konuşma Hafızası (Memory Context Buffer):**
   - Kullanıcının önceki söylediklerini (isim, tercihler, sohbet akışı) hatırlar ve bağlama uygun cevap verir.
2. **3 Sağlayıcılı Fallback Zinciri:**
   1. Groq (Llama-3.3 70B / 3.1 8B) — varsayılan birincil
   2. Google Gemini (3.8 Flash / Flash Latest / 3.1 Flash Lite) — yedek
   3. OpenRouter (ücretsiz uyumlu modeller) — son yedek
   - Her sağlayıcı/model isteği en fazla **8 saniye** beklenir; sunucu panelindeki açık sağlayıcı tercihi korunur.
   > Not: `gemini-2.5-flash` ve `gemini-1.5-flash` artık Discord/Gemini tarafında 404 döndürdüğü için model listesinden kaldırılmıştır.
3. **Doğal Türkçe "Vega" Kişiliği:**
   - Samimi, zeki, esprili, kod yazabilen, çeviri ve özetleme yapabilen uzman asistan.
4. **Hızlı Yanıt & Discord Yazıyor Göstergesi (`sendTyping`):**
   - Yavaş AI etkileşimleri önce ertelenir; kullanıcıya sağlayıcı hata ayrıntıları sızdırılmadan Türkçe durum mesajı gösterilir.

---

## 💻 Çalıştırma ve Dağıtım

```bash
# Bağımlılıkları yükleyin
npm install

# Web Panelini ve Botu Geliştirme Modunda Başlatın
npm run dev

# Botu Bağımsız Derleyin
npm run build:bot

# Tüm Projeyi Derleyin
npm run build

# Üretim web paneli + bot sunucusunu başlatın (NODE_ENV=production)
npm run start

# Slash Komutlarını Discord API'ye Dağıtın
npm run deploy:commands
```

### Prefix ve slash komutları

- Discord'a **yalnızca global `/yardim`** kaydedilir. Diğer komutlar `.` önekiyle çalışır (ör. `.ping`, `.ban`, `.kiss`).
- `npm run deploy:commands`, global listeyi yalnızca `/yardim` ile değiştirir ve botun bulunduğu sunuculardaki eski sunucu-özel slash komutlarını temizler. Discord istemcisindeki eski menü önbelleği için birkaç dakika bekleyip komut listesini yenileyin.
- Prefix komutları, karşılık gelen slash komutunun `default_member_permissions` kuralını da uygular; izin bilgisi çözümlenemediğinde komut güvenlik nedeniyle çalıştırılmaz.

### Bot için moderasyon izinleri

Komut kapsamına göre botta şu izinler gerekir: `View Audit Log`, `Kick Members`, `Ban Members`, `Manage Roles`, `Manage Channels`, `Manage Messages`, `Read Message History`, `Moderate Members`, `View Channel`, `Send Messages`, `Embed Links` ve Captcha için `Attach Files`. Özellikle `.lock`/`.unlock` kanal izinlerini değiştirmek için `Manage Roles` ister; `.nuke` için `Manage Channels` ve rol izinlerinin korunması adına `Manage Roles` gerekir. Kullanıcıya gereken izinler komut bazında ayrıca denetlenir.

### Güvenli bot davet bağlantısı

Davet bağlantısı yalnızca `CLIENT_ID` veya `BOT_CLIENT_ID` tanımlandığında üretilir. Varsayılan izin değeri `0`'dır; botu davet ederken yalnızca ihtiyaç duyduğunuz izinleri seçin. İzin bitlerini açıkça belirlemek için `BOT_INVITE_PERMISSIONS` kullanabilirsiniz. Global bot-sahibi ayrıcalığı için `BOT_OWNER_ID` ayarlayın; varsayılan olarak kapalıdır.

Dashboard API için `DASHBOARD_API_TOKEN` tanımlayın. `/api` uçları bu token ile korunur; AI canlı test endpoint'i ayrıca istek hızı, prompt uzunluğu ve eşzamanlılık sınırlarına sahiptir.
