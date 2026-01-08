# 🚀 Deployment Rehberi - Arhaval.com

## Vercel ile Deployment (Önerilen)

### Adım 1: GitHub'a Yükleme

1. GitHub'da yeni bir repository oluşturun: `arhavalcom`
2. Projeyi GitHub'a yükleyin:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/arhavalcom.git
git push -u origin main
```

### Adım 2: Vercel'e Bağlama

1. [Vercel.com](https://vercel.com) adresine gidin
2. "Sign Up" ile GitHub hesabınızla giriş yapın
3. "Add New Project" butonuna tıklayın
4. GitHub repository'nizi seçin (`arhavalcom`)
5. Ayarlar:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (boş bırakın)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. "Deploy" butonuna tıklayın

### Adım 3: Domain Ayarları

#### Ana Domain (arhaval.com)

1. Vercel dashboard'da projenize gidin
2. "Settings" → "Domains" sekmesine gidin
3. `arhaval.com` domain'ini ekleyin
4. DNS ayarlarını yapın:
   - **A Record**: `@` → Vercel'in verdiği IP adresi
   - **CNAME Record**: `www` → `cname.vercel-dns.com`

#### Subdomain (live.arhaval.com)

1. Aynı projede "Domains" sekmesine gidin
2. `live.arhaval.com` domain'ini ekleyin
3. DNS ayarlarını yapın:
   - **CNAME Record**: `live` → `cname.vercel-dns.com`

**Not**: Subdomain routing zaten kodda mevcut. `live.arhaval.com` otomatik olarak LiveApp'i, `arhaval.com` ise App'i gösterir.

### Adım 4: Environment Variables (Gerekirse)

Şu an için environment variable gerekmiyor, ancak ileride eklemek isterseniz:
- Vercel Dashboard → Settings → Environment Variables

## Alternatif: Netlify

### Netlify ile Deployment

1. [Netlify.com](https://netlify.com) adresine gidin
2. GitHub ile giriş yapın
3. "New site from Git" → Repository seçin
4. Build ayarları:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. "Deploy site" butonuna tıklayın

### Netlify Domain Ayarları

1. Site Settings → Domain management
2. Custom domain ekleyin: `arhaval.com`
3. DNS ayarlarını yapın (Netlify'in verdiği nameserver'ları kullanın)

## Build Komutları

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Build
npm run preview
```

## Önemli Notlar

1. **Subdomain Routing**: 
   - `arhaval.com` → Portfolio (App.jsx)
   - `live.arhaval.com` → Prediction System (LiveApp.jsx)
   - Routing `src/main.jsx` dosyasında hostname kontrolü ile yapılıyor

2. **LocalStorage**: 
   - Tüm veriler tarayıcı localStorage'ında saklanıyor
   - Production'da bu veriler kullanıcı bazlı olacak
   - İleride backend entegrasyonu yapılabilir

3. **Görseller**: 
   - `public/images/` klasöründeki görseller otomatik olarak deploy edilir
   - URL'ler `/images/logo.png` formatında kullanılmalı

4. **Admin Panelleri**:
   - Portfolio Admin: `arhaval.com/admin/content` (şifre: `arhaval2024`)
   - Live Admin: `live.arhaval.com/admin` (şifre: `arhaval2024`)

## Sorun Giderme

### Build Hatası
- `npm install` komutunu çalıştırın
- Node.js versiyonunuz 18+ olmalı

### Domain Çalışmıyor
- DNS ayarlarının yayılması 24-48 saat sürebilir
- DNS propagation kontrolü: [whatsmydns.net](https://www.whatsmydns.net)

### Subdomain Çalışmıyor
- Vercel'de her iki domain'i de eklediğinizden emin olun
- `src/main.jsx` dosyasındaki hostname kontrolünü kontrol edin

## Destek

Sorun yaşarsanız:
1. Vercel/Netlify logs'larını kontrol edin
2. Browser console'da hataları kontrol edin
3. Build log'larını inceleyin


