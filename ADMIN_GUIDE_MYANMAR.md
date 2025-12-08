# 🎬 NETWORK CHANEL - Admin Panel အသုံးပြုနည်း

## မာတိကာ

1. [Admin Panel ဝင်ရောက်ခြင်း](#admin-panel-ဝင်ရောက်ခြင်း)
2. [Dashboard အသုံးပြုခြင်း](#dashboard-အသုံးပြုခြင်း)
3. [ဗီဒီယို Content များ ထည့်သွင်းခြင်း](#ဗီဒီယို-content-များ-ထည့်သွင်းခြင်း)
4. [Auto-Extract Feature အသုံးပြုခြင်း](#auto-extract-feature-အသုံးပြုခြင်း)
5. [Content များ တည်းဖြတ်ခြင်း](#content-များ-တည်းဖြတ်ခြင်း)
6. [Genre များ စီမံခန့်ခွဲခြင်း](#genre-များ-စီမံခန့်ခွဲခြင်း)
7. [Feed Import အသုံးပြုခြင်း](#feed-import-အသုံးပြုခြင်း)

---

## Admin Panel ဝင်ရောက်ခြင်း

### 🔐 Login လုပ်နည်း

#### အဆင့် ၁ - Admin URL သို့ သွားပါ
```
https://your-site.vercel.app/dashboard-nmc-2024
```
သို့မဟုတ် Local တွင်:
```
http://localhost:3000/dashboard-nmc-2024
```

#### အဆင့် ၂ - Password ထည့်သွင်းပါ
```
Password: NetworkChanel2024!
```

#### အဆင့် ၃ - "Access Dashboard" ကို နှိပ်ပါ

**သတိပြုရန်:**
- ဤ Admin URL သည် လုံခြုံရေးအတွက် လျှို့ဝှက်ထားသည်
- Website ရှိ Navigation menu တွင် မပေါ်ပါ
- Password ကို လုံခြုံစွာ သိမ်းဆည်းထားပါ

---

## Dashboard အသုံးပြုခြင်း

### 📊 Dashboard ပင်မစာမျက်နှာ

Login ဝင်ရောက်ပြီးနောက် သင်မြင်ရမည်မှာ:

#### ၁. Statistics Cards (စာရင်းအင်း ကတ်များ)
- **Total Content** - စုစုပေါင်း ဗီဒီယို အရေအတွက်
- **Movies** - ရုပ်ရှင် အရေအတွက်
- **Documentaries** - သရုပ်ဖော် အရေအတွက်
- **Total Views** - စုစုပေါင်း ကြည့်ရှုမှု အရေအတွက်
- **Feed Sources** - Feed ရင်းမြစ် အရေအတွက်

#### ၂. Quick Actions (လျင်မြန်သော လုပ်ဆောင်ချက်များ)
- **Content Management** - ဗီဒီယို စီမံခန့်ခွဲခြင်း
- **Genre Management** - အမျိုးအစား စီမံခန့်ခွဲခြင်း
- **Feed Import** - RSS Feed မှ ဗီဒီယို တင်သွင်းခြင်း

#### ၃. Recent Uploads (မကြာသေးမီ တင်ခဲ့သော ဗီဒီယိုများ)
- နောက်ဆုံး ထည့်သွင်းထားသော content များ
- ကြည့်ရှုမှု အရေအတွက်
- တင်သွင်းသည့် ရက်စွဲ

---

## ဗီဒီယို Content များ ထည့်သွင်းခြင်း

### 🎬 Content အသစ် ထည့်နည်း

#### အဆင့် ၁ - Content Management သို့ သွားပါ
```
Dashboard → Content Management → Add Content
```
သို့မဟုတ်:
```
http://localhost:3000/dashboard-nmc-2024/content/add
```

#### အဆင့် ၂ - Video URL ထည့်ပါ

**အထောက်အကူပြု Platform များ:**
- ✅ YouTube
- ✅ Vimeo
- ✅ Dailymotion
- ✅ Google Drive
- ✅ တိုက်ရိုက် MP4 link များ

**ဥပမာ URL များ:**
```
YouTube: https://www.youtube.com/watch?v=VIDEO_ID
Vimeo: https://vimeo.com/123456789
Dailymotion: https://www.dailymotion.com/video/x9jc39s
```

#### အဆင့် ၃ - အချက်အလက်များ ဖြည့်သွင်းပါ

**လိုအပ်သော အချက်အလက်များ (Required):**
- **Title** - ဗီဒီယို ခေါင်းစဉ်
- **Video URL** - ဗီဒီယို လင့်ခ်
- **Type** - Movie သို့မဟုတ် Documentary

**ရွေးချယ်နိုင်သော အချက်အလက်များ (Optional):**
- **Description** - ဗီဒီယို ဖော်ပြချက်
- **Thumbnail URL** - ဓာတ်ပုံ link
- **Year** - ထွက်ရှိသည့် နှစ်
- **Duration** - အချိန်ကြာ (မိနစ်)
- **Rating** - အဆင့်သတ်မှတ်ချက် (0-10)
- **Cast** - သရုပ်ဆောင်များ
- **Genres** - အမျိုးအစားများ ရွေးချယ်ပါ

#### အဆင့် ၄ - Save လုပ်ပါ
- **"Add Content"** ခလုတ်ကို နှိပ်ပါ
- အောင်မြင်ပါက Content list သို့ ပြန်သွားမည်

---

## Auto-Extract Feature အသုံးပြုခြင်း

### ✨ အလိုအလျောက် အချက်အလက် ထုတ်ယူခြင်း

ဤ feature သည် Video URL မှ အလိုအလျောက် အချက်အလက်များကို ထုတ်ယူပေးသည်။

#### လုပ်ဆောင်ပုံ:

**၁. Video URL ကို paste လုပ်ပါ**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**၂. စောင့်ဆိုင်းပါ (1-2 စက္ကန့်)**
- Loading spinner ပေါ်လာမည်
- အလိုအလျောက် ထုတ်ယူနေသည်

**၃. အလိုအလျောက် ဖြည့်သွင်းပေးမည်:**
- ✅ **Title** - ဗီဒီယို ခေါင်းစဉ်
- ✅ **Description** - ဖော်ပြချက်
- ✅ **Thumbnail URL** - ဓာတ်ပုံ link
- ✅ **Duration** - အချိန်ကြာ (ရှိလျှင်)
- ✅ Green checkmark (✓) များ ပေါ်လာမည်
- ✅ Success notification ပေါ်မည်

**၄. Manual Auto-Fill ခလုတ်:**
- ✨ **"Auto-Fill"** ခလုတ်ကို နှိပ်ပါ
- အချက်အလက်များကို ပြန်လည် ထုတ်ယူမည်

**၅. Thumbnail Preview:**
- Thumbnail URL ရှိပါက
- ဓာတ်ပုံကို အောက်တွင် ကြိုတင်ကြည့်ရှုနိုင်သည်

### အလုပ်လုပ်ပုံ:

**YouTube အတွက်:**
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
↓
Title: "Rick Astley - Never Gonna Give You Up"
Thumbnail: https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
```

**Vimeo အတွက်:**
```
URL: https://vimeo.com/148751763
↓
Title: Auto-extracted from Vimeo
Thumbnail: Auto-generated
```

**Dailymotion အတွက်:**
```
URL: https://www.dailymotion.com/video/x9jc39s
↓
Title: Auto-extracted from Dailymotion
Thumbnail: Auto-generated
Duration: Auto-calculated
```

---

## Content များ တည်းဖြတ်ခြင်း

### ✏️ ရှိပြီးသား Content ကို ပြင်ဆင်နည်း

#### အဆင့် ၁ - Content Management သို့ သွားပါ
```
Dashboard → Content Management
```

#### အဆင့် ၂ - Edit ခလုတ်ကို နှိပ်ပါ
- ပြင်ဆင်လိုသော content တွင်
- **"Edit"** ခလုတ်ကို နှိပ်ပါ

#### အဆင့် ၃ - အချက်အလက်များ ပြင်ဆင်ပါ
- Title, Description, Thumbnail စသည်
- လိုအပ်သော field များကို ပြင်ပါ

#### အဆင့် ၄ - Update လုပ်ပါ
- **"Update Content"** ကို နှိပ်ပါ
- Content list သို့ ပြန်သွားမည်

### 🗑️ Content ဖျက်နည်း

#### အဆင့် ၁ - Delete ခလုတ်ကို နှိပ်ပါ
- ဖျက်လိုသော content တွင်
- **"Delete"** ခလုတ်ကို နှိပ်ပါ

#### အဆင့် ၂ - အတည်ပြုပါ
- Confirmation dialog ပေါ်လာမည်
- **"Yes, Delete"** ကို နှိပ်ပါ

**သတိပြုရန်:**
- ဖျက်ပြီးသော content ကို ပြန်လည် ရယူ၍ မရပါ
- သေချာပြီးမှ ဖျက်ပါ

---

## Genre များ စီမံခန့်ခွဲခြင်း

### 📁 Genre အသစ် ထည့်နည်း

#### အဆင့် ၁ - Genre Management သို့ သွားပါ
```
Dashboard → Genre Management
```

#### အဆင့် ၂ - "Add Genre" ကို နှိပ်ပါ

#### အဆင့် ၃ - Genre အမည် ထည့်ပါ
```
ဥပမာ:
- Action (အက်ရှင်)
- Comedy (ဟာသ)
- Drama (ဒရာမာ)
- Horror (ထိတ်လန့်ဖွယ်)
- Documentary (မှတ်တမ်း)
- Romance (အချစ်ဇာတ်လမ်း)
- Sci-Fi (သိပ္ပံ စိတ်ကူး)
- Thriller (ရှုပ်ထွေး)
```

#### အဆင့် ၄ - Save လုပ်ပါ
- **"Add Genre"** ကို နှိပ်ပါ

### ✏️ Genre ပြင်ဆင်နည်း / ဖျက်နည်း

- Genre list တွင်
- **Edit** သို့မဟုတ် **Delete** ကို နှိပ်ပါ

---

## Feed Import အသုံးပြုခြင်း

### 📡 RSS Feed မှ ဗီဒီယို များ တင်သွင်းနည်း

#### အဆင့် ၁ - Feed Management သို့ သွားပါ
```
Dashboard → Feed Import
```

#### အဆင့် ၂ - Feed အသစ် ထည့်ပါ
- **"Add Feed"** ကို နှိပ်ပါ
- Feed Name ထည့်ပါ
- RSS Feed URL ထည့်ပါ

**ဥပမာ Feed URL:**
```
https://example.com/rss/feed.xml
```

#### အဆင့် ၃ - Feed ကို Preview ကြည့်ပါ
- **"Preview"** ခလုတ်ကို နှိပ်ပါ
- ရရှိမည့် content များကို ကြည့်ပါ

#### အဆင့် ၄ - Import လုပ်ပါ
- ရွေးချယ်ထားသော items များကို
- **"Import Selected"** ကို နှိပ်ပါ

#### အဆင့် ၅ - Auto-Sync သတ်မှတ်ပါ (Optional)
- Feed ကို အလိုအလျောက် sync လုပ်ရန်
- Sync interval သတ်မှတ်ပါ
  - နာရီတိုင်း
  - တစ်ရက်တာ
  - အပတ်စဉ်

---

## အသုံးဝင်သော အကြံပြုချက်များ

### 💡 Tips & Tricks

#### ၁. Video URL များ စုဆောင်းထားပါ
- ထည့်လိုသော ဗီဒီယို link များကို
- Notepad သို့မဟုတ် text file တွင် သိမ်းထားပါ
- တစ်ခါတည်း အများကြီး ထည့်နိုင်သည်

#### ၂. Auto-Extract ကို အသုံးပြုပါ
- Video URL paste လုပ်ရုံဖြင့်
- အချက်အလက်များ အလိုအလျောက် ရယူပေးသည်
- အချိန် သက်သာစေသည်

#### ၃. Thumbnail များ စစ်ဆေးပါ
- Thumbnail preview ကို ကြည့်ပါ
- ရှင်းလင်းပြတ်သားစွာ ပေါ်နေသလား စစ်ပါ
- မပေါ်ပါက custom thumbnail link ထည့်ပါ

#### ၄. Genre များ မှန်ကန်စွာ ရွေးပါ
- ဗီဒီယို နှင့် ကိုက်ညီသော genre ရွေးပါ
- အများကြီး မရွေးပါနှင့် (2-3 ခု အကောင်းဆုံး)
- User များ ရှာဖွေရ လွယ်ကူစေသည်

#### ၅. Description အသေးစိတ် ရေးပါ
- ဗီဒီယို အကြောင်း အတိုချုပ်
- သရုပ်ဆောင်များ (ရှိလျှင်)
- အထူးအချက်များ

---

## အဖြစ်များသော ပြဿနာများ နှင့် ဖြေရှင်းနည်း

### ❓ FAQ (မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ)

#### ၁. Admin Page ဝင်၍ မရပါ (404 Error)
**ဖြေရှင်း:**
- URL ကို စစ်ဆေးပါ: `/dashboard-nmc-2024` ဖြစ်ရမည်
- `/admin` ဟောင်း URL ကို အသုံးပြု၍ မရတော့ပါ

#### ၂. Password မှား နေပါသည်
**ဖြေရှင်း:**
- Password: `NetworkChanel2024!` (အစလုံး အကြီး)
- Copy & Paste လုပ်ပါ
- Space များ မပါရန် သေချာပါ

#### ၃. ဗီဒီယို မပေါ်ပါ
**ဖြေရှင်း:**
- Video URL မှန်ကန်ကြောင်း စစ်ပါ
- Platform ကို အထောက်အကူပြုသလား စစ်ပါ
- Browser cache ကို clear လုပ်ပါ

#### ၄. Auto-Extract အလုပ်မလုပ်ပါ
**ဖြေရှင်း:**
- URL ပြည့်စုံပြီး http:// သို့မဟုတ် https:// ပါရန်
- အင်တာနက် ချိတ်ဆက်မှု စစ်ပါ
- Manual "Auto-Fill" ခလုတ်ကို နှိပ်ကြည့်ပါ

#### ၅. Save လုပ်ပြီး 404 Error ပေါ်တယ်
**ဖြေရှင်း:**
- ဤ ပြဿနာ ပြင်ဆင်ပြီးပါပြီ
- Browser ကို refresh လုပ်ပါ
- မအောင်မြင်ပါက server ကို restart လုပ်ပါ

---

## လုံခြုံရေး အကြံပြုချက်များ

### 🔒 Security Best Practices

#### ၁. Password ကို ပြောင်းပါ
- Default password: `NetworkChanel2024!`
- Production တွင် ပြောင်းလဲပါ
- ခိုင်မာသော password အသုံးပြုပါ

#### ၂. Admin URL ကို လျှို့ဝှက်ပါ
- `/dashboard-nmc-2024` ကို မျှဝေ မလုပ်ပါနှင့်
- လိုအပ်သူများသာ ပေးပါ
- Public post များတွင် မထည့်ပါနှင့်

#### ၃. Session Management
- Browser ပိတ်လိုက်ပါက session ကုန်ဆုံးသည်
- Shared computer တွင် အမြဲ logout လုပ်ပါ

#### ၄. နေ့စဉ် Backup လုပ်ပါ
- Content များကို backup လုပ်ထားပါ
- Database backup ယူပါ
- ထိန်းသိမ်းရေး အရေးကြီးသည်

---

## Production Deployment

### 🚀 Vercel တွင် Deploy လုပ်နည်း

#### အဆင့် ၁ - Environment Variables သတ်မှတ်ပါ
Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_ADMIN_PASSWORD = YourSecurePassword123!
DATABASE_URL = your_database_url
NEXT_PUBLIC_SITE_URL = https://your-site.vercel.app
```

#### အဆင့် ၂ - Deploy လုပ်ပါ
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

#### အဆင့် ၃ - Test လုပ်ပါ
- Production URL သို့ သွားပါ
- Admin panel login ကို စမ်းပါ
- Content များ ထည့်ကြည့်ပါ

---

## အကူအညီ နှင့် Support

### 📞 ပြဿနာ ရှိပါက

#### ၁. Documentation ကို ဖတ်ပါ
- QUICK_START.md
- DEPLOYMENT_GUIDE.md
- ADMIN_ACCESS.md

#### ၂. Console ကို စစ်ဆေးပါ
- Browser DevTools (F12)
- Console tab ကို ကြည့်ပါ
- Error message များ ကူးယူပါ

#### ၃. Server Logs ကို စစ်ဆေးပါ
- Terminal window ကို ကြည့်ပါ
- Error messages များ ရှာပါ

---

## အပိုဆောင်း အချက်အလက်များ

### 📚 Additional Resources

#### Documentation Files:
- **QUICK_START.md** - အမြန် စတင်နည်း
- **DEPLOYMENT_GUIDE.md** - Deploy လုပ်နည်း အသေးစိတ်
- **ADMIN_ACCESS.md** - Admin ဝင်ရောက်နည်း
- **IMPLEMENTATION_SUMMARY.md** - အပြောင်းအလဲများ အားလုံး

#### Admin URLs:
```
Local: http://localhost:3000/dashboard-nmc-2024
Production: https://your-site.vercel.app/dashboard-nmc-2024
```

#### Default Credentials:
```
Password: NetworkChanel2024!
(Production တွင် ပြောင်းရန် သတိရပါ!)
```

---

## နိဂုံး

ဤ guide သည် Network Chanel Admin Panel ကို အသုံးပြုရာတွင် အထောက်အကူ ပြုပါလိမ့်မည်။ ပြဿနာများ ရှိပါက documentation များကို ပြန်လည် ဖတ်ရှုပါ သို့မဟုတ် console errors များကို စစ်ဆေးပါ။

**အောင်မြင်ကြပါစေ!** 🎉

---

**Version:** 1.0  
**Last Updated:** 2024  
**Language:** Myanmar (Burmese)
