# Arhaval Esports - Profesyonel Esports Web Sitesi

Modern, akışkan ve sürükleyici bir tasarıma sahip single-page esports web sitesi.

## 🎨 Tasarım Özellikleri

- **Fluid & Immersive Design**: Keskin çizgiler olmadan, bütünleşik bir yapı
- **Glassmorphism**: Buzlu cam efektli kartlar ve bileşenler
- **Neon Glow Effects**: #ff2e63 (neon pink) ve #08d9d6 (cyan) renklerinde parlama efektleri
- **Gradient Transitions**: Bölümler arası yumuşak geçişler

## 🎨 Renk Paleti

- **Background**: `#252a34` (Koyu gri/lacivert)
- **Primary Neon**: `#ff2e63` (Neon pembe)
- **Secondary Cyan**: `#08d9d6` (Cyan)
- **Text**: `#eaeaea` (Açık gri)

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:5173` adresini açın.

## 📦 Build

Production build için:
```bash
npm run build
```

Build edilmiş dosyaları önizlemek için:
```bash
npm run preview
```

## 🚀 Deployment

Detaylı deployment rehberi için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

**Hızlı Başlangıç (Vercel):**
1. GitHub'a projeyi yükleyin
2. [Vercel.com](https://vercel.com) adresine gidin
3. GitHub repository'nizi bağlayın
4. Otomatik deploy edilir!

**Domain Yapısı:**
- `arhaval.com` → Portfolio sitesi
- `live.arhaval.com` → Canlı tahmin sistemi

## 🛠️ Teknolojiler

- **React 18** - UI framework
- **Vite** - Build tool ve dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

## 📝 Özellikler

- ✅ Responsive tasarım (Mobile-First)
- ✅ Sticky navbar (scroll'da blur efekti)
- ✅ Full-screen hero section (fade-out efekti)
- ✅ Glassmorphism kartlar
- ✅ Canlı yayın merkezi (Twitch embed hazır)
- ✅ İstatistik gösterimi
- ✅ Smooth scroll navigasyon

## 📺 Twitch Entegrasyonu

Canlı yayın bölümünde Twitch embed'i eklemek için `src/App.jsx` dosyasındaki `LiveStream` component'inde yorum satırını kaldırın ve kendi Twitch kanalınızı ekleyin:

```jsx
<iframe 
  src="https://player.twitch.tv/?channel=arhavalesports&parent=yourdomain.com" 
  frameborder="0" 
  allowfullscreen 
  className="w-full h-full"
/>
```

## 📄 Lisans

Bu proje Arhaval Esports için özel olarak geliştirilmiştir.



