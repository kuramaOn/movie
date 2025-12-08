# Network Chanel - ဗီဒီယိုထုတ်လွှင့်ရေးပလက်ဖောင်း

Netflix ပုံစံ ဗီဒီယိုထုတ်လွှင့်ရေးပလက်ဖောင်းအပြည့်အစုံတစ်ခုဖြစ်ပြီး Next.js 14 ဖြင့် တည်ဆောက်ထားကာ ရုပ်ရှင်များနှင့် မှတ်တမ်းရုပ်ရှင်များကို အလိုအလျောက် အကြံပြုချက်များနှင့် RSS/API feed များမှ အကြောင်းအရာများ တင်သွင်းနိုင်သည့် စွမ်းရည်များပါရှိပါသည်။

## အင်္ဂါရပ်များ

- 🎬 Netflix ပုံစံ UI နှင့် အမှောင်အပြင်အဆင်
- 🎥 ဖွင့်ပြသမှုထိန်းချုပ်မှုများပါဝင်သော အဆင့်မြင့် ဗီဒီယိုပလေယာ
- 📺 YouTube, Vimeo နှင့် တိုက်ရိုက်ဗီဒီယို URL များအတွက် ပံ့ပိုးမှု
- 🔄 RSS/API feed တင်သွင်းမှုစနစ်
- 📊 အကြောင်းအရာစီမံခန့်ခွဲမှု အပြည့်အစုံပါဝင်သော Admin panel
- 🎯 အမျိုးအစားများအပေါ် အခြေခံသော အလိုအလျောက်အကြံပြုချက်များ
- 📱 အပြည့်အဝ တုံ့ပြန်မှုရှိသော ဒီဇိုင်း
- ⚡ Next.js 14 App Router ဖြင့် တည်ဆောက်ထားခြင်း
- 🗄️ Prisma ORM ပါဝင်သော MySQL ဒေတာဘေ့စ်

## နည်းပညာအစုအဝေး

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Railway ပေါ်တွင် MySQL
- **ORM**: Prisma
- **Video Player**: react-player
- **Deployment**: Vercel (frontend + API), Railway (database)

## လိုအပ်ချက်များ

- Node.js 18+ ထည့်သွင်းထားရမည်
- MySQL database (Railway သို့မဟုတ် local)
- npm သို့မဟုတ် yarn package manager

## ထည့်သွင်းခြင်း

### ၁။ repository ကို clone လုပ်ပါ

```bash
git clone <repository-url>
cd network-chanel
```

### ၂။ dependencies များကို ထည့်သွင်းပါ

```bash
npm install
```

### ၃။ environment variables များကို ပြင်ဆင်သတ်မှတ်ပါ

root directory တွင် `.env` ဖိုင်တစ်ခုဖန်တီးပါ:

```env
DATABASE_URL="mysql://root:UMGuHqHmWjCdYiSjYyxwpHHyGLsSzUOO@mysql.railway.internal:3306/railway"
NEXT_PUBLIC_SITE_URL="https://network-chanel.vercel.app"
YOUTUBE_API_KEY="သင့်_youtube_api_key_လိုအပ်ပါက"
VIMEO_ACCESS_TOKEN="သင့်_vimeo_token_လိုအပ်ပါက"
```

XAMPP ဖြင့် local development အတွက်:
```env
DATABASE_URL="mysql://root:@localhost:3306/network_chanel"
```

### ၄။ Prisma Client ကို ထုတ်လုပ်ပါ

```bash
npx prisma generate
```

### ၅။ database schema ကို push လုပ်ပါ

```bash
npx prisma db push
```

သင့် MySQL database တွင် လိုအပ်သော ဇယားများအားလုံးကို ဖန်တီးပေးမည်။

### ၆။ development server ကို run လုပ်ပါ

```bash
npm run dev
```

application ကိုကြည့်ရန် [http://localhost:3000](http://localhost:3000) ကိုဖွင့်ပါ။

## ဒေတာဘေ့စ် Schema

application သည် အောက်ပါဇယားများကို အသုံးပြုသည်:

- **content** - ရုပ်ရှင်များနှင့် မှတ်တမ်းရုပ်ရှင်များကို သိမ်းဆည်းခြင်း
- **genres** - အကြောင်းအရာ အမျိုးအစားများ/အမျိုးအစားများ
- **content_genres** - အကြောင်းအရာ-အမျိုးအစား ဆက်နွယ်မှုများအတွက် junction table
- **feed_sources** - RSS/API feed အရင်းအမြစ်များ
- **sync_logs** - Feed synchronization မှတ်တမ်းများ

## အသုံးပြုပုံ

### Admin Panel

`/admin` တွင် admin panel ကိုဝင်ရောက်ပါ (authentication မလိုအပ်ပါ)။

#### အကြောင်းအရာ စီမံခန့်ခွဲမှု

1. **Admin Dashboard** → **Content Management** သို့သွားပါ
2. ရုပ်ရှင်များ/မှတ်တမ်းရုပ်ရှင်များကို ကိုယ်တိုင်ထည့်ရန် **Add Content** ကိုနှိပ်ပါ
3. ဖောင်တွင် ဖြည့်သွင်းပါ:
   - ခေါင်းစဉ်၊ ဖော်ပြချက်၊ အမျိုးအစား (ရုပ်ရှင်/မှတ်တမ်းရုပ်ရှင်)
   - ဗီဒီယို URL (YouTube, Vimeo, သို့မဟုတ် တိုက်ရိုက် link)
   - ပုံငယ် URL
   - နှစ်၊ ကြာချိန်၊ အဆင့်သတ်မှတ်ချက်၊ သရုပ်ဆောင်များ
   - အမျိုးအစားများကို ရွေးချယ်ပါ
4. သိမ်းဆည်းရန် **Add Content** ကို နှိပ်ပါ

#### အမျိုးအစား စီမံခန့်ခွဲမှု

1. **Admin Dashboard** → **Genre Management** သို့သွားပါ
2. အမျိုးအစားအသစ်များဖန်တီးရန် **Add Genre** ကိုနှိပ်ပါ
3. အမျိုးအစားအမည်ကို ရိုက်ထည့်ပါ (slug သည် အလိုအလျောက်ထုတ်လုပ်သည်)
4. ရှိပြီးသား အမျိုးအစားများကို edit/delete ခလုတ်များဖြင့် စီမံခန့်ခွဲပါ

#### Feed တင်သွင်းမှုစနစ်

1. **Admin Dashboard** → **Feed Import** သို့သွားပါ
2. feed source အသစ်တစ်ခုဖန်တီးရန် **Add Feed** ကိုနှိပ်ပါ
3. feed အမျိုးအစားကို ရွေးချယ်ပါ:
   - **RSS Feed**: စံ RSS 2.0 / Atom feeds
   - **JSON API**: စိုက်ကြိုက် JSON endpoints
   - **YouTube Channel**: channel ID + API key ထည့်ပါ
   - **YouTube Playlist**: playlist ID + API key ထည့်ပါ
   - **Vimeo**: user ID + access token ထည့်ပါ
4. auto-sync ဆက်တင်များကို configure လုပ်ပါ (optional)
5. ရရှိနိုင်သော ဗီဒီယိုများကိုကြည့်ရန် **Preview Feed** ကိုနှိပ်ပါ
6. ဗီဒီယိုများကို ရွေးချယ်ပြီး default အမျိုးအစားများ/အမျိုးအစားကို ရွေးပါ
7. အကြောင်းအရာကို တင်သွင်းရန် **Import Selected** ကိုနှိပ်ပါ

### အများပြည်သူ စာမျက်နှာများ

- **Homepage** (`/`) - ထင်ရှားသော အကြောင်းအရာ၊ နောက်ဆုံးထွက် uploads များ၊ ခေတ်စားနေသော၊ အမျိုးအစား rows များ
- **Browse** (`/browse`) - filters များပါဝင်သော Grid view (အမျိုးအစား၊ အမျိုးအစား၊ ရှာဖွေမှု)
- **Watch** (`/watch/[id]`) - အကြောင်းအရာအသေးစိတ်များနှင့် အကြံပြုချက်များပါဝင်သော ဗီဒီယိုပလေယာ

### ဗီဒီယိုပလေယာ အင်္ဂါရပ်များ

- Play/Pause, အသံအတိုးအလျှော့ ထိန်းချုပ်မှု, mute
- seek ပါဝင်သော Progress bar
- Fullscreen mode
- Playback speed control (0.5x - 2x)
- Skip intro (ပထမ 30s) နှင့် skip outro (နောက်ဆုံး 60s)
- Picture-in-Picture mode (တိုက်ရိုက်ဗီဒီယိုများအတွက်)
- ဆက်လက်ကြည့်ရှုခြင်း (localStorage တွင် အနေအထားကို သိမ်းဆည်းသည်)
- Multi-source support (YouTube, Vimeo, တိုက်ရိုက် URLs)

## API Endpoints

### အများပြည်သူ APIs

- `GET /api/content` - filters များဖြင့် အကြောင်းအရာအားလုံးကို ရယူပါ
- `GET /api/content/[id]` - အကြောင်းအရာတစ်ခုချင်းကို ရယူပါ
- `GET /api/content/[id]/suggestions` - အကြံပြုချက်များကို ရယူပါ
- `GET /api/genres` - အမျိုးအစားအားလုံးကို ရယူပါ
- `GET /api/featured` - ထင်ရှားသော အကြောင်းအရာကို ရယူပါ
- `GET /api/latest` - နောက်ဆုံးထွက် အကြောင်းအရာကို ရယူပါ
- `GET /api/trending` - ခေတ်စားနေသော အကြောင်းအရာကို ရယူပါ
- `POST /api/track-view/[id]` - ဗီဒီယိုကြည့်ရှုမှုကို ခြေရာခံပါ

### Admin APIs

- `GET/POST /api/admin/content` - အကြောင်းအရာများကို စာရင်းပြုစု/ဖန်တီးပါ
- `PUT/DELETE /api/admin/content/[id]` - အကြောင်းအရာကို update/delete လုပ်ပါ
- `GET/POST /api/admin/genres` - အမျိုးအစားများကို စာရင်းပြုစု/ဖန်တီးပါ
- `PUT/DELETE /api/admin/genres/[id]` - အမျိုးအစားကို update/delete လုပ်ပါ
- `GET/POST /api/admin/feeds` - feeds များကို စာရင်းပြုစု/ဖန်တီးပါ
- `DELETE /api/admin/feeds/[id]` - feed ကို delete လုပ်ပါ
- `POST /api/admin/feeds/[id]/preview` - feed ကို အစမ်းကြည့်ပါ
- `POST /api/admin/feeds/[id]/import` - ရွေးချယ်ထားသော items များကို တင်သွင်းပါ
- `POST /api/admin/feeds/[id]/sync` - ကိုယ်တိုင် sync လုပ်ပါ
- `GET /api/admin/feeds/[id]/logs` - sync logs များကို ရယူပါ
- `GET /api/admin/stats` - dashboard စာရင်းဇယားများကို ရယူပါ

### Cron Job

- `GET /api/cron/sync-feeds` - feeds အားလုံးကို အလိုအလျောက် sync လုပ်ပါ (Vercel တွင် ၆ နာရီတစ်ကြိမ် run လုပ်သည်)

## Deployment

### Vercel သို့ Deploy လုပ်ပါ

1. သင့် code ကို GitHub သို့ push လုပ်ပါ
2. project ကို Vercel သို့ import လုပ်ပါ
3. Vercel dashboard တွင် environment variables များထည့်ပါ
4. Deploy လုပ်ပါ

```bash
vercel
```

### Railway Database

MySQL database ကို ပေးထားသော URL ဖြင့် configure လုပ်ပြီးသားဖြစ်သည်။ production အတွက်:

1. Railway database သည် ဝင်ရောက်နိုင်ကြောင်း သေချာပါစေ
2. Vercel environment variables တွင် `DATABASE_URL` ကို update လုပ်ပါ
3. production တွင် migrations များကို run လုပ်ပါ (Vercel သည် postinstall မှတစ်ဆင့် `npx prisma generate` ကို အလိုအလျောက် run လုပ်သည်)

### Auto-Sync Cron Job

Vercel Cron ကို `vercel.json` တွင် ၆ နာရီတစ်ကြိမ် run ရန် configure လုပ်ထားသည်။ ၎င်းသည် auto-sync ဖွင့်ထားသော feeds များကို အလိုအလျောက် sync လုပ်သည်။

## Development

### Project Structure

```
network-chanel/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── browse/            # Browse page
│   ├── watch/             # Watch page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── ContentCard.tsx
│   ├── ContentRow.tsx
│   ├── VideoPlayer.tsx
│   └── LoadingSkeleton.tsx
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   ├── feedParsers.ts    # Feed parsing logic
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static files
├── package.json
├── next.config.js
├── tailwind.config.js
└── vercel.json           # Vercel configuration
```

### အင်္ဂါရပ်အသစ်များထည့်ခြင်း

1. `app/api/` တွင် API routes အသစ်များဖန်တီးပါ
2. `app/` တွင် pages အသစ်များဖန်တီးပါ
3. `components/` တွင် ပြန်လည်အသုံးပြုနိုင်သော components များဖန်တီးပါ
4. database ပြောင်းလဲမှုများလိုအပ်ပါက Prisma schema ကို update လုပ်ပါ

### Debugging

- frontend errors များအတွက် browser console ကို စစ်ဆေးပါ
- API errors များအတွက် Vercel logs များကို စစ်ဆေးပါ
- database ကို စစ်ဆေးရန် Prisma Studio ကို အသုံးပြုပါ: `npx prisma studio`

## ပြဿနာဖြေရှင်းခြင်း

### Database ချိတ်ဆက်မှုပြဿနာများ

- `DATABASE_URL` မှန်ကန်ကြောင်း စစ်ဆေးပါ
- Railway အတွက်၊ database run နေကြောင်း သေချာပါစေ
- local MySQL အတွက်၊ XAMPP/MySQL စတင်ထားကြောင်း သေချာပါစေ

### Feed တင်သွင်းမှုပြဿနာများ

- API keys များ မှန်ကန်ကြောင်း စစ်ဆေးပါ (YouTube, Vimeo)
- feed URL သည် ဝင်ရောက်နိုင်ကြောင်း စစ်ဆေးပါ
- admin panel တွင် sync logs များကို သုံးသပ်ပါ

### ဗီဒီယိုဖွင့်ပြသမှုပြဿနာများ

- ဗီဒီယို URL သည် အများပြည်သူ ဝင်ရောက်နိုင်ကြောင်း သေချာပါစေ
- ဗီဒီယို source သည် embedding ကို ခွင့်ပြုထားကြောင်း စစ်ဆေးပါ
- YouTube အတွက်၊ ဗီဒီယိုကို ကန့်သတ်ထားခြင်းမရှိကြောင်း စစ်ဆေးပါ

## ပံ့ပိုးမှု

ပြဿနာများ သို့မဟုတ် မေးခွန်းများအတွက်:

1. အထက်ပါ API documentation ကို စစ်ဆေးပါ
2. database structure အတွက် Prisma schema ကို သုံးသပ်ပါ
3. Vercel deployment logs များကို စစ်ဆေးပါ
4. environment variables များကို မှန်ကန်စွာ သတ်မှတ်ထားကြောင်း စစ်ဆေးပါ

## လိုင်စင်

ဤ project သည် ပညာရေး/သရုပ်ပြမှု ရည်ရွယ်ချက်များအတွက် ဖြစ်သည်။

## ဂုဏ်ပြုချီးမွမ်းမှု

အောက်ပါတို့ဖြင့် တည်ဆောက်ထားသည်:
- Next.js 14
- React
- Tailwind CSS
- Prisma
- react-player
- Heroicons
