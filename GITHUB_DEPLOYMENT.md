# 🚀 GitHub + Vercel Deployment - Adım Adım Rehber

## 📋 ÖN HAZIRLIK

### 1. Git Kurulumu (Eğer yüklü değilse)

**Windows için:**
1. [Git for Windows](https://git-scm.com/download/win) indirin
2. Kurulumu yapın (varsayılan ayarlarla devam edin)
3. PowerShell'i yeniden başlatın

**Kontrol:**
```bash
git --version
```

---

## 🔵 ADIM 1: GitHub'da Repository Oluşturma

1. [github.com](https://github.com) adresine gidin
2. Sağ üstteki **"+"** butonuna tıklayın
3. **"New repository"** seçin
4. Repository bilgilerini doldurun:
   - **Repository name**: `arhavalcom` (veya istediğiniz isim)
   - **Description**: (opsiyonel) "Arhaval Esports Website"
   - **Public** veya **Private** seçin
   - **Initialize this repository with a README** ❌ (işaretlemeyin)
5. **"Create repository"** butonuna tıklayın

---

## 💻 ADIM 2: Projeyi GitHub'a Yükleme

### Terminal/PowerShell'de proje klasörüne gidin:

```bash
cd C:\Users\Asus\Desktop\arhavalcom
```

### Git'i başlatın:

```bash
git init
```

### Tüm dosyaları ekleyin:

```bash
git add .
```

### İlk commit'i yapın:

```bash
git commit -m "Initial commit - Ready for deployment"
```

### GitHub repository'nizi ekleyin:

**ÖNEMLİ:** GitHub'da oluşturduğunuz repository'nin URL'ini kullanın!

```bash
git remote add origin https://github.com/KULLANICI_ADINIZ/arhavalcom.git
```

**Örnek:** Eğer GitHub kullanıcı adınız `arhaval` ise:
```bash
git remote add origin https://github.com/arhaval/arhavalcom.git
```

### Ana branch'i ayarlayın:

```bash
git branch -M main
```

### GitHub'a yükleyin:

```bash
git push -u origin main
```

**Not:** İlk kez yapıyorsanız GitHub kullanıcı adı ve şifre (veya Personal Access Token) isteyebilir.

---

## 🟢 ADIM 3: Vercel'e Bağlama

### 1. Vercel'e Git

1. [vercel.com](https://vercel.com) adresine gidin
2. **"Sign Up"** veya **"Log In"** yapın
3. **GitHub ile giriş yapın** (önerilen)

### 2. Yeni Proje Ekle

1. Dashboard'da **"Add New Project"** butonuna tıklayın
2. GitHub repository'nizi seçin (`arhavalcom`)
3. **"Import"** butonuna tıklayın

### 3. Proje Ayarları

Vercel otomatik olarak algılar, ama kontrol edin:

- **Framework Preset**: `Vite` ✅
- **Root Directory**: `./` (boş bırakın)
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

### 4. Environment Variables

Şu an için gerekli değil, boş bırakabilirsiniz.

### 5. Deploy!

**"Deploy"** butonuna tıklayın! 🚀

---

## 🌐 ADIM 4: Domain Bağlama

### Vercel Dashboard'da:

1. Projenize tıklayın
2. **"Settings"** sekmesine gidin
3. **"Domains"** sekmesine tıklayın
4. Domain ekleyin:

#### Ana Domain (arhaval.com):
- `arhaval.com` yazın ve **"Add"** tıklayın
- Vercel size DNS ayarlarını gösterecek

#### Subdomain (live.arhaval.com):
- `live.arhaval.com` yazın ve **"Add"** tıklayın
- Aynı DNS ayarlarını kullanın

### DNS Ayarları (Domain sağlayıcınızda):

Vercel size şu bilgileri verecek:

**Örnek DNS Ayarları:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: live
Value: cname.vercel-dns.com
```

**Domain sağlayıcınızın DNS panelinde bu ayarları yapın:**
- Namecheap
- GoDaddy
- Cloudflare
- vs.

**Not:** DNS değişikliklerinin yayılması 24-48 saat sürebilir.

---

## ✅ ADIM 5: Kontrol

### Deployment Başarılı mı?

1. Vercel dashboard'da projenize gidin
2. **"Deployments"** sekmesinde yeşil ✅ görmelisiniz
3. **"Visit"** butonuna tıklayarak siteyi görüntüleyin

### Test:

- `https://arhavalcom.vercel.app` → Vercel'in verdiği geçici URL
- `https://arhaval.com` → Domain bağlandıktan sonra
- `https://live.arhaval.com` → Subdomain

---

## 🔧 Sorun Giderme

### Git Push Hatası:

**"Authentication failed"** hatası alırsanız:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Yeni token oluşturun (repo yetkisi verin)
3. Şifre yerine token kullanın

### Build Hatası:

Vercel logs'ları kontrol edin:
- Proje → Deployments → Hatalı deployment → Logs

### Domain Çalışmıyor:

- DNS ayarlarını kontrol edin
- [whatsmydns.net](https://www.whatsmydns.net) ile DNS propagation kontrol edin
- 24-48 saat bekleyin

---

## 📝 Özet Komutlar

```bash
# Proje klasörüne git
cd C:\Users\Asus\Desktop\arhavalcom

# Git başlat
git init

# Dosyaları ekle
git add .

# Commit yap
git commit -m "Initial commit"

# GitHub repository ekle (KULLANICI_ADINIZ'ı değiştirin!)
git remote add origin https://github.com/KULLANICI_ADINIZ/arhavalcom.git

# Ana branch
git branch -M main

# GitHub'a yükle
git push -u origin main
```

---

## 🎉 Başarılı!

Artık:
- ✅ GitHub'da kodunuz var
- ✅ Vercel'de site yayında
- ✅ Her değişiklikte otomatik deploy

**Gelecekte:** Kod değişikliklerinde:
```bash
git add .
git commit -m "Değişiklik açıklaması"
git push
```

Vercel otomatik olarak yeni deployment yapacak! 🚀


