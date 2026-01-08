# 🎨 Logo Ekleme Rehberi

## 📍 Logo Nerede Gösterilecek?

Logo şu yerlerde gösterilecek:
1. **Navbar** (Üst menü) - Sol üst köşe
2. **Hero Section** (Ana sayfa büyük başlık) - Ortada
3. **Footer** (Alt kısım) - Sol alt köşe

---

## 🛠️ Logo Nasıl Eklenir?

### **Adım 1: Logo Dosyasını Yerleştirin**

**Seçenek 1: Public Klasörü (Önerilen)**
```
arhavalcom/
  └── public/
      └── logo.png  (veya logo.svg, logo.jpg)
```

**Seçenek 2: Online URL**
- Logo bir web sitesinde ise URL'yi kullanın
- Örnek: `https://arhaval.com/logo.png`

---

### **Adım 2: Logo URL'sini Ayarlayın**

**Dosya:** `src/App.jsx` - Satır 10-18

```jsx
const LOGO_CONFIG = {
  // Logo URL'si
  url: '/logo.png', // Public klasöründen: '/logo.png'
  // veya online: 'https://arhaval.com/logo.png'
  
  // Logo yüklenemezse metin gösterilsin mi?
  showTextFallback: true,
  
  // Logo boyutları
  navbar: { width: 120, height: 40 },   // Navbar için
  hero: { width: 300, height: 100 },   // Hero section için
  footer: { width: 150, height: 50 }   // Footer için
}
```

---

## 📝 Örnekler

### **Örnek 1: Public Klasöründen Logo**
```jsx
url: '/logo.png'
```

### **Örnek 2: Online Logo**
```jsx
url: 'https://arhaval.com/images/logo.png'
```

### **Örnek 3: SVG Logo**
```jsx
url: '/logo.svg'
```

### **Örnek 4: Logo Boyutlarını Ayarla**
```jsx
navbar: { width: 150, height: 50 },  // Daha büyük navbar logosu
hero: { width: 400, height: 150 },   // Daha büyük hero logosu
```

### **Örnek 5: Sadece Logo Göster (Metin Yok)**
```jsx
showTextFallback: false  // Logo yüklenemezse hiçbir şey gösterme
```

---

## 🎯 Hızlı Başlangıç

1. **Logo dosyanızı hazırlayın**
   - PNG, SVG veya JPG formatında
   - Şeffaf arka plan önerilir (PNG)

2. **Public klasörüne koyun**
   - `public/logo.png` olarak kaydedin

3. **App.jsx'i güncelleyin**
   - Satır 12: `url: '/logo.png'` yapın

4. **Test edin**
   - Sayfayı yenileyin
   - Logo görünmeli!

---

## 💡 İpuçları

- **Logo Formatı:** PNG (şeffaf) veya SVG (ölçeklenebilir) önerilir
- **Boyutlar:** Logo dosyası yeterince büyük olmalı (en az 300x100px)
- **Renkler:** Koyu arka plan için açık renkli logo kullanın
- **Fallback:** `showTextFallback: true` ile logo yüklenemezse "ARHAVAL" yazısı gösterilir

---

## 🔧 Sorun Giderme

**Logo görünmüyor:**
- Dosya yolunu kontrol edin (`/logo.png` doğru mu?)
- Public klasöründe mi?
- Dosya adı büyük/küçük harf duyarlı mı?

**Logo çok büyük/küçük:**
- `LOGO_CONFIG` içindeki boyutları ayarlayın
- `width` ve `height` değerlerini değiştirin

**Logo yüklenemiyor:**
- `showTextFallback: true` ise "ARHAVAL" yazısı gösterilir
- Console'da hata var mı kontrol edin




