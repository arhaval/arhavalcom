# 🌐 Domain Yapısı Planı

## 📋 Yapı

### **arhaval.com** (Ana Domain)
- Portfolio sitesi
- Hakkımızda, Hizmetler, İstatistikler
- TRCS Belgeselleri
- Temiz ve profesyonel görünüm

### **live.arhaval.com** (Subdomain)
- Tahmin sistemi
- Kullanıcı giriş/kayıt
- Liderlik tablosu
- Admin paneli
- Canlı tahmin sayfası

---

## 🛠️ Uygulama Seçenekleri

### **Seçenek 1: Tek Uygulama, Koşullu Routing (Önerilen)**

**Avantajlar:**
- ✅ Tek kod tabanı
- ✅ Kolay yönetim
- ✅ Paylaşılan bileşenler

**Yapı:**
```
arhaval.com → Portfolio (App.jsx)
live.arhaval.com → Tahmin Sistemi (LiveApp.jsx)
```

**Routing:**
- `window.location.hostname` kontrolü
- Subdomain'e göre farklı uygulama göster

### **Seçenek 2: Ayrı Uygulamalar**

**Avantajlar:**
- ✅ Tamamen ayrı
- ✅ Bağımsız deployment
- ✅ Farklı teknolojiler kullanılabilir

**Dezavantajlar:**
- ⚠️ İki kod tabanı
- ⚠️ Daha fazla yönetim

---

## 🚀 Önerilen: Seçenek 1

### Uygulama:

1. **Ana Uygulama (arhaval.com)**
   - Mevcut `App.jsx` (Portfolio)
   - Temiz ve profesyonel

2. **Live Uygulama (live.arhaval.com)**
   - Yeni `LiveApp.jsx`
   - Tahmin sistemi
   - Kullanıcı sistemi
   - Liderlik tablosu

3. **Router Kontrolü**
   - `main.jsx` içinde hostname kontrolü
   - Subdomain'e göre uygulama seç

---

## 📁 Dosya Yapısı

```
src/
  ├── App.jsx (Portfolio - arhaval.com)
  ├── LiveApp.jsx (Tahmin Sistemi - live.arhaval.com)
  ├── main.jsx (Router kontrolü)
  ├── pages/
  │   ├── AdminDashboard.jsx
  │   ├── PredictionsAdmin.jsx
  │   ├── PredictionPage.jsx
  │   ├── Leaderboard.jsx
  │   ├── Login.jsx
  │   └── Register.jsx
  └── components/
```

---

## 🔧 Deployment

### Vercel/Netlify:
- `arhaval.com` → Ana branch
- `live.arhaval.com` → Aynı repo, subdomain routing

### Nginx:
- Subdomain routing
- Aynı uygulama, farklı entry point

---

## 💡 Hızlı Uygulama

1. `LiveApp.jsx` oluştur
2. `main.jsx`'e hostname kontrolü ekle
3. Routing'i düzenle
4. Test et



