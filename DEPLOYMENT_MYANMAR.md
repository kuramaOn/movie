# 🚀 NETWORK CHANEL - Vercel တွင် Deploy လုပ်နည်း

## မာတိကာ

1. [GitHub သို့ Upload လုပ်ခြင်း](#github-သို့-upload-လုပ်ခြင်း)
2. [Vercel Account ပြုလုပ်ခြင်း](#vercel-account-ပြုလုပ်ခြင်း)
3. [Vercel သို့ Deploy လုပ်ခြင်း](#vercel-သို့-deploy-လုပ်ခြင်း)
4. [Environment Variables သတ်မှတ်ခြင်း](#environment-variables-သတ်မှတ်ခြင်း)
5. [Deploy စစ်ဆေးခြင်း](#deploy-စစ်ဆေးခြင်း)
6. [ပြဿနာများ ဖြေရှင်းခြင်း](#ပြဿနာများ-ဖြေရှင်းခြင်း)

---

## လိုအပ်ချက်များ

ဤ project ကို deploy လုပ်ရန် လိုအပ်သည်များ:

- ✅ GitHub account
- ✅ Vercel account (အခမဲ့)
- ✅ Network Chanel project (ဤ project)
- ✅ Database URL (Railway database)

---

## GitHub သို့ Upload လုပ်ခြင်း

### အဆင့် ၁ - GitHub Repository ပြုလုပ်ပါ

#### ၁.၁ GitHub သို့ သွားပါ
```
https://github.com
```

#### ၁.၂ Login လုပ်ပါ
- သင့် GitHub account ဖြင့် login လုပ်ပါ

#### ၁.၃ New Repository ပြုလုပ်ပါ
1. ညာဘက်အပေါ် **"+"** icon ကို နှိပ်ပါ
2. **"New repository"** ကို ရွေးပါ
3. Repository name: `movie_web`
4. Description: `Network Chanel - Video Streaming Platform`
5. Public သို့မဟုတ် Private ရွေးပါ
6. **"Create repository"** ကို နှိပ်ပါ

### အဆင့် ၂ - Local Project မှ GitHub သို့ Upload လုပ်ပါ

#### ၂.၁ Git Initialize လုပ်ပါ

PowerShell သို့မဟုတ် Terminal တွင်:

```bash
cd C:\Users\black\OneDrive\Desktop\test\movie_web
```

```bash
git init
```

#### ၂.၂ Files များ Add လုပ်ပါ

```bash
git add .
```

#### ၂.၃ Commit လုပ်ပါ

```bash
git commit -m "Initial commit: Network Chanel complete"
```

#### ၂.၄ GitHub Repository နှင့် ချိတ်ဆက်ပါ

```bash
git remote add origin https://github.com/YOUR_USERNAME/movie_web.git
```

**သတိပြုရန်:** `YOUR_USERNAME` ကို သင့် GitHub username ဖြင့် အစားထိုးပါ

#### ၂.၅ GitHub သို့ Push လုပ်ပါ

```bash
git branch -M main
git push -u origin main
```

**အောင်မြင်ခြင်း စစ်ဆေးရန်:**
- GitHub repository သို့ သွားကြည့်ပါ
- Files များ ပေါ်နေရမည်

---

## Vercel Account ပြုလုပ်ခြင်း

### အဆင့် ၃ - Vercel သို့ သွားပါ

#### ၃.၁ Vercel Website ဖွင့်ပါ
```
https://vercel.com
```

#### ၃.၂ Sign Up လုပ်ပါ

1. **"Sign Up"** ခလုတ်ကို နှိပ်ပါ
2. **"Continue with GitHub"** ကို ရွေးပါ
3. GitHub account ဖြင့် authorize လုပ်ပါ
4. Vercel ကို GitHub repositories များ ကြည့်ခွင့် ပေးပါ

**သတိပြုရန်:**
- Vercel သည် အခမဲ့ ဖြစ်သည်
- Credit card မလိုအပ်ပါ

---

## Vercel သို့ Deploy လုပ်ခြင်း

### အဆင့် ၄ - Project Import လုပ်ပါ

#### ၄.၁ New Project ပြုလုပ်ပါ

1. Vercel dashboard သို့ သွားပါ:
   ```
   https://vercel.com/new
   ```

2. **"Import Git Repository"** ကို နှိပ်ပါ

3. သင့် GitHub repositories list ပေါ်လာမည်

#### ၄.၂ movie_web Repository ကို ရှာပါ

1. List မှ **"movie_web"** ကို ရှာပါ
2. **"Import"** ခလုတ်ကို နှိပ်ပါ

**သတိပြုရန်:**
- Repository မတွေ့ပါက "Adjust GitHub App Permissions" ကို နှိပ်ပါ
- Vercel ကို repository access ပေးပါ

### အဆင့် ၅ - Project Configuration

#### ၅.၁ Configure Project Settings

**Project Name:**
- Default: `movie-web`
- သို့မဟုတ် ကြိုက်သလို ပြောင်းလဲပါ

**Framework Preset:**
- **Next.js** ကို အလိုအလျောက် ရွေးထားမည်
- ပြောင်း စရာ မလိုပါ

**Root Directory:**
- Default: `./`
- မပြောင်းပါနှင့်

**Build Command:**
- Default: `npm run build`
- မပြောင်းပါနှင့်

**Output Directory:**
- Default: `.next`
- မပြောင်းပါနှင့်

---

## Environment Variables သတ်မှတ်ခြင်း

### အဆင့် ၆ - Environment Variables ထည့်ပါ

⚠️ **အရေးကြီးဆုံး အဆင့်!** ဤ variables များ မထည့်ပါက website အလုပ် မလုပ်ပါ။

#### ၆.၁ Environment Variables Section ကို ဖွင့်ပါ

Deploy page တွင်:
1. **"Environment Variables"** section ကို ရှာပါ
2. **"Add"** သို့မဟုတ် **"+"** icon ကို နှိပ်ပါ

#### ၆.၂ Variable #1 - DATABASE_URL

**Name (အမည်):**
```
DATABASE_URL
```

**Value (တန်ဖိုး):**
```
mysql://root:UMGuHqHmWjCdYiSjYyxwpHHyGLsSzUOO@metro.proxy.rlwy.net:29632/railway
```

**Environment (ပတ်ဝန်းကျင်):**
- ☑️ Production
- ☑️ Preview
- ☑️ Development

**အားလုံးကို ခြစ်ပါ!**

**"Add" ကို နှိပ်ပါ**

#### ၆.၃ Variable #2 - NEXT_PUBLIC_ADMIN_PASSWORD

**Name (အမည်):**
```
NEXT_PUBLIC_ADMIN_PASSWORD
```

**Value (တန်ဖိုး):**
```
NetworkChanel2024!
```

**Environment (ပတ်ဝန်းကျင်):**
- ☑️ Production
- ☑️ Preview
- ☑️ Development

**အားလုံးကို ခြစ်ပါ!**

**"Add" ကို နှိပ်ပါ**

#### ၆.၄ Variable #3 - NEXT_PUBLIC_SITE_URL (Optional)

**Name (အမည်):**
```
NEXT_PUBLIC_SITE_URL
```

**Value (တန်ဖိုး):**
```
(ဗလာ ထားပါ - Vercel က အလိုအလျောက် ဖြည့်ပေးမည်)
```

သို့မဟုတ် ဤ variable ကို မထည့်လည်း ရပါသည်။

### အဆင့် ၇ - Deploy ခလုတ်ကို နှိပ်ပါ

Environment variables အားလုံး ထည့်ပြီးပါက:

1. အောက်ဆုံးသို့ scroll လုပ်ပါ
2. **"Deploy"** ခလုတ် (အပြာရောင်) ကို နှိပ်ပါ

---

## Deploy စစ်ဆေးခြင်း

### အဆင့် ၈ - Building Process ကို စောင့်ဆိုင်းပါ

#### ၈.၁ Build Log ကို ကြည့်ပါ

Deploy နှိပ်ပြီးနောက် build log screen ပေါ်လာမည်:

```
⏳ Initializing build...
✓ Installing dependencies...
✓ Building application...
✓ Uploading build output...
✓ Running checks...
```

**အချိန်ကြာ:** 2-5 မိနစ်

#### ၈.၂ Success Message ကို စောင့်ပါ

အောင်မြင်ပါက မြင်ရမည်:

```
🎉 Congratulations!
Your project has been deployed!
```

URL တစ်ခု ပေါ်လာမည်:
```
https://movie-web-xxx.vercel.app
```

**ဤ URL သည် သင့် live website ဖြစ်သည်!**

---

## Website ကို စမ်းသပ်ခြင်း

### အဆင့် ၉ - Public Website စစ်ဆေးပါ

#### ၉.၁ Homepage ကို ဖွင့်ပါ

သင့် Vercel URL ကို browser တွင် ဖွင့်ပါ:
```
https://movie-web-xxx.vercel.app
```

**မြင်ရမည်များ:**
- ✅ Hero section with animations
- ✅ Navigation bar
- ✅ Content sections
- ✅ Smooth animations

#### ၉.၂ Admin Panel စစ်ဆေးပါ

Admin URL သို့ သွားပါ:
```
https://movie-web-xxx.vercel.app/dashboard-nmc-2024
```

**မြင်ရမည်များ:**
- ✅ Login screen
- ✅ Password field
- ✅ Shield icon animation

**Login လုပ်ပါ:**
```
Password: NetworkChanel2024!
```

**Login အောင်မြင်ပါက:**
- ✅ Dashboard ပေါ်လာမည်
- ✅ Statistics cards
- ✅ Management options

#### ၉.၃ Content Add လုပ်ကြည့်ပါ

1. Dashboard မှ **"Content Management"** ကို နှိပ်ပါ
2. **"Add Content"** ကို နှိပ်ပါ
3. YouTube URL တစ်ခု paste လုပ်ပါ:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
4. Auto-extract feature က metadata ထုတ်ယူပေးသင့်သည်
5. **"Add Content"** ကို နှိပ်ပါ
6. Content list သို့ ပြန်သွားသင့်သည် (404 error မရှိရပါ)

---

## ပြဿနာများ ဖြေရှင်းခြင်း

### ❌ ပြဿနာ ၁: 404 Error (DEPLOYMENT_NOT_FOUND)

**အကြောင်းရင်း:**
- Environment variables မထည့်ရသေးပါ
- Deploy လုပ်နေဆဲ ဖြစ်သည်
- Build fail ဖြစ်သွားသည်

**ဖြေရှင်း:**

1. **Environment Variables စစ်ဆေးပါ:**
   - Vercel dashboard → Project → Settings → Environment Variables
   - DATABASE_URL ရှိ/မရှိ စစ်ပါ
   - NEXT_PUBLIC_ADMIN_PASSWORD ရှိ/မရှိ စစ်ပါ

2. **မရှိပါက ထည့်ပါ:**
   - အထက်ပါ အဆင့် ၆ ကို လိုက်နာပါ
   - ထည့်ပြီးပါက Redeploy လုပ်ပါ

3. **Redeploy လုပ်နည်း:**
   - Deployments tab သို့ သွားပါ
   - နောက်ဆုံး deployment ရှာပါ
   - **"..."** menu ကို နှိပ်ပါ
   - **"Redeploy"** ကို ရွေးပါ
   - **"Redeploy"** ကို အတည်ပြုပါ

### ❌ ပြဿနာ ၂: Build Failed (အနီရောင် X)

**အကြောင်းရင်း:**
- Code errors
- Missing dependencies
- Database connection issues

**ဖြေရှင်း:**

1. **Build Log ကို ဖတ်ပါ:**
   - Failed deployment ကို နှိပ်ပါ
   - Build log ကို ဖတ်ပါ
   - အနီရောင် error messages ရှာပါ

2. **အဖြစ်များသော errors:**

**Error: Cannot find module**
```
Solution: package.json မှ dependency ပျောက်နေသည်
Check: GitHub repository တွင် package.json ပါ/မပါ
```

**Error: Database connection failed**
```
Solution: DATABASE_URL မှားနေသည်
Check: Environment variable တွင် DATABASE_URL မှန်/မမှန်
```

**Error: Build timeout**
```
Solution: Build ကြာလွန်းသည်
Check: .next folder ကို .gitignore တွင် ထည့်ထားပါ
```

### ❌ ပြဿနာ ၃: Admin Login မရပါ

**Symptom (လက္ခဏာ):**
- Password ထည့်လည်း login မဝင်နိုင်ပါ
- "Incorrect password" error ပေါ်သည်

**ဖြေရှင်း:**

1. **Password မှန်ကြောင်း စစ်ပါ:**
   ```
   NetworkChanel2024!
   ```
   - အစလုံး **N** ဖြစ်ရမည်
   - အဆုံး **!** ပါရမည်
   - Space များ မပါရပါ

2. **Environment Variable စစ်ပါ:**
   - Settings → Environment Variables
   - NEXT_PUBLIC_ADMIN_PASSWORD ရှိ/မရှိ
   - Value မှန်/မမှန်

3. **Browser Cache ရှင်းပါ:**
   - Ctrl + Shift + Delete (Windows)
   - Cmd + Shift + Delete (Mac)
   - Cache and cookies ကို clear လုပ်ပါ

### ❌ ပြဿနာ ၄: Videos မပေါ်ပါ

**Symptom (လက္ခဏာ):**
- Video player ပေါ်သော်လည်း ဗီဒီယို မပေါ်ပါ
- Loading spinner အဆက်မပြတ် လည်နေသည်

**ဖြေရှင်း:**

1. **Video URL မှန်ကြောင်း စစ်ပါ:**
   - YouTube, Vimeo, Dailymotion URL များ အသုံးပြုပါ
   - Complete URL ဖြစ်ရမည် (http:// or https://)

2. **Platform Support စစ်ပါ:**
   - ✅ YouTube: https://youtube.com/watch?v=...
   - ✅ Vimeo: https://vimeo.com/...
   - ✅ Dailymotion: https://dailymotion.com/video/...
   - ❌ Unsupported platforms မပါရပါ

3. **Browser Console စစ်ပါ:**
   - F12 ကို နှိပ်ပါ
   - Console tab သို့ သွားပါ
   - Error messages ရှာပါ

### ❌ ပြဿနာ ၅: Auto-Extract မအလုပ်လုပ်ပါ

**Symptom (လက္ခဏာ):**
- Video URL paste လုပ်လည်း metadata မထုတ်ပါ
- Loading spinner မပေါ်ပါ

**ဖြေရှင်း:**

1. **URL ပြည့်စုံကြောင်း စစ်ပါ:**
   ```
   ✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ❌ youtube.com/watch?v=dQw4w9WgXcQ (http:// မပါ)
   ```

2. **Manual Auto-Fill Button ကို နှိပ်ပါ:**
   - ✨ "Auto-Fill" ခလုတ်ကို နှိပ်ပါ
   - Manual refresh လုပ်ပါ

3. **Internet Connection စစ်ပါ:**
   - Server က external API များကို ခေါ်သည်
   - Internet ချိတ်ဆက်မှု လိုအပ်သည်

---

## အပိုဆောင်း သတင်းအချက်အလက်များ

### 🔧 Custom Domain ချိတ်ဆက်ခြင်း

သင့်ကိုယ်ပိုင် domain name ရှိပါက:

#### အဆင့် ၁ - Domain Settings သို့ သွားပါ

1. Vercel project သို့ သွားပါ
2. **Settings** tab
3. **Domains** section
4. **"Add Domain"** ကို နှိပ်ပါ

#### အဆင့် ၂ - Domain ထည့်ပါ

1. သင့် domain name ကို ထည့်ပါ
   ```
   example: yourdomain.com
   ```

2. **"Add"** ကို နှိပ်ပါ

#### အဆင့် ၃ - DNS Configuration

Vercel က DNS records များ ပေးမည်:

1. သင့် domain provider သို့ သွားပါ
2. DNS settings ကို ဖွင့်ပါ
3. Vercel က ပေးသော records များကို ထည့်ပါ
4. 24-48 နာရီ စောင့်ပါ

### 📊 Analytics ကြည့်ရှုခြင်း

Vercel Analytics ကို အသုံးပြုပါ:

1. Project → Analytics tab
2. ကြည့်ရှုနိုင်သည်များ:
   - Page views
   - Unique visitors
   - Popular pages
   - Performance metrics

### 🔄 Auto-Deploy သတ်မှတ်ခြင်း

GitHub က code ပြောင်းလဲတိုင်း အလိုအလျောက် deploy လုပ်သည်:

1. Local တွင် code ပြင်ပါ
2. Git commit လုပ်ပါ:
   ```bash
   git add .
   git commit -m "Update: description"
   git push origin main
   ```
3. Vercel က အလိုအလျောက် deploy လုပ်မည်
4. 2-3 မိနစ် အတွင်း live ဖြစ်မည်

### 🌍 Environment များ

Vercel တွင် 3 မျိုး ရှိသည်:

**Production:**
- Main branch မှ deploy လုပ်သည်
- Live URL: https://movie-web.vercel.app

**Preview:**
- Other branches များမှ deploy လုပ်သည်
- Testing အတွက်

**Development:**
- Local development အတွက်

---

## လုံခြုံရေး အကြံပြုချက်များ

### 🔒 Admin Password ပြောင်းလဲခြင်း

Production တွင် default password ကို ပြောင်းပါ:

#### အဆင့် ၁ - Password အသစ် ရွေးပါ

ခိုင်မာသော password တစ်ခု ရွေးပါ:
```
ဥပမာ: MySecure@Password2024!
```

#### အဆင့် ၂ - Vercel တွင် ပြောင်းပါ

1. Settings → Environment Variables
2. NEXT_PUBLIC_ADMIN_PASSWORD ကို ရှာပါ
3. **"Edit"** ကို နှိပ်ပါ
4. Password အသစ် ထည့်ပါ
5. **"Save"** ကို နှိပ်ပါ
6. Redeploy လုပ်ပါ

#### အဆင့် ၃ - Local တွင် ပြောင်းပါ

`.env.local` file တွင်:
```
NEXT_PUBLIC_ADMIN_PASSWORD=MySecure@Password2024!
```

### 🔐 Admin URL လျှို့ဝှက်ထားခြင်း

`/dashboard-nmc-2024` URL ကို:
- မျှဝေ မလုပ်ပါနှင့်
- Public post များတွင် မတင်ပါနှင့်
- လိုအပ်သူများသာ ပေးပါ

### 🗄️ Database Backup

နေ့စဉ် backup လုပ်ပါ:
- Railway dashboard → Backups
- Manual backup ယူပါ
- Important data များကို သိမ်းဆည်းပါ

---

## နိဂုံး

### ✅ သင် ယခု လုပ်နိုင်ပြီ:

- ✅ GitHub သို့ project upload လုပ်နိုင်သည်
- ✅ Vercel တွင် deploy လုပ်နိုင်သည်
- ✅ Environment variables သတ်မှတ်နိုင်သည်
- ✅ Admin panel ကို အသုံးပြုနိုင်သည်
- ✅ Content များ ထည့်သွင်းနိုင်သည်
- ✅ ပြဿနာများကို ဖြေရှင်းနိုင်သည်

### 📚 နောက်ထပ် လေ့လာရန်:

- **ADMIN_GUIDE_MYANMAR.md** - Admin panel အသုံးပြုနည်း
- **QUICK_START.md** - အမြန် စတင်နည်း
- **DEPLOYMENT_GUIDE.md** - အသေးစိတ် deployment guide

### 🎉 အောင်မြင်ပါစေ!

သင့် Network Chanel platform သည် ယခု အွန်လိုင်းတွင် live ဖြစ်ပြီ!

**Live URL နမူနာ:**
```
https://movie-web-xxx.vercel.app
```

**Admin Access:**
```
https://movie-web-xxx.vercel.app/dashboard-nmc-2024
Password: NetworkChanel2024!
```

---

**Version:** 1.0  
**Last Updated:** 2024  
**Language:** Myanmar (Burmese)  
**Platform:** Vercel  

---

## အကူအညီ လိုအပ်ပါက

### 📞 အဖြစ်များသော မေးခွန်းများ:

**Q: Deploy ကြာလွန်းပါသည်**  
A: ပုံမှန် 2-5 မိနစ် ကြာသည်။ 10 မိနစ် ကျော်ပါက build logs ကို စစ်ပါ။

**Q: Website ဖြူတာ တွေ့နေရပါသည်**  
A: Database connection issue ဖြစ်နိုင်သည်။ DATABASE_URL ကို စစ်ပါ။

**Q: Mobile တွင် မပြသပါ**  
A: Browser cache ရှင်းပါ။ Mobile responsive ဖြစ်သင့်သည်။

---

**ပြဿနာများ ရှိပါက documentation files များကို ပြန်လည် ဖတ်ရှုပါ။**

**အောင်မြင်မှု များ ဖြစ်ပါစေ!** 🚀
