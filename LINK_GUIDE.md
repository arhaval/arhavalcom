# 🔗 Link Düzenleme Rehberi

## 📍 Linklerin Konumları

### 1. **Navbar Linkleri** (Üst Menü)
**Dosya:** `src/App.jsx` - Satır 27-32 (Desktop) ve 43-47 (Mobil)

**Mevcut Linkler:**
```jsx
<a href="#hero">Ana Sayfa</a>
<a href="#about">Hakkımızda</a>
<a href="#services">Hizmetler</a>
<a href="#stats">İstatistikler</a>
<a href="#trcs">TRCS Belgeselleri</a>
```

**Nasıl Düzenlenir:**
- Link metnini değiştir: `"Ana Sayfa"` → `"Yeni İsim"`
- Link hedefini değiştir: `href="#hero"` → `href="#yeni-bolum"`
- Link ekle: Yeni `<a>` etiketi ekle
- Link kaldır: `<a>` etiketini sil

---

### 2. **Sosyal Medya Linkleri** (Footer)
**Dosya:** `src/App.jsx` - Satır 631-636

**Mevcut Linkler:**
```jsx
const socialLinks = [
  { icon: Twitch, href: '#', label: 'Twitch' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'Youtube' }
]
```

**Nasıl Düzenlenir:**
- URL değiştir: `href: '#'` → `href: 'https://twitch.tv/arhaval'`
- Link ekle: Yeni obje ekle
- Link kaldır: Objeyi sil

---

### 3. **Partner Linkleri**
**Dosya:** `src/App.jsx` - StrategicPartners component

**Nasıl Düzenlenir:**
- Partner ekle/çıkar
- URL değiştir

---

### 4. **TRCS Belgeselleri Linkleri**
**Dosya:** `src/App.jsx` - TRCSDocumentaries component

**Nasıl Düzenlenir:**
- Video ID değiştir
- YouTube linki ekle

---

## 🛠️ Hızlı Düzenleme Örnekleri

### Örnek 1: Navbar'a Yeni Link Ekle
```jsx
// src/App.jsx - Satır 32'den sonra
<a href="#contact" className="text-white hover:text-primary-neon transition-colors font-medium">
  İletişim
</a>
```

### Örnek 2: Sosyal Medya Linkini Güncelle
```jsx
// src/App.jsx - Satır 632
{ icon: Twitch, href: 'https://twitch.tv/arhaval', label: 'Twitch' },
```

### Örnek 3: Link Metnini Değiştir
```jsx
// "Hakkımızda" → "Hakkımız"
<a href="#about" className="...">Hakkımız</a>
```

### Örnek 4: Link Kaldır
```jsx
// Bu satırı sil:
<a href="#stats" className="...">İstatistikler</a>
```

---

## 📝 Link Türleri

### **Anchor Linkler (Sayfa İçi)**
```jsx
<a href="#hero">Ana Sayfa</a>
```
- Sayfa içinde bölüme gider
- `#` ile başlar

### **Dış Linkler**
```jsx
<a href="https://twitch.tv/arhaval" target="_blank" rel="noopener noreferrer">
  Twitch
</a>
```
- Dış siteye gider
- `target="_blank"` yeni sekmede açar

### **React Router Linkler**
```jsx
<Link to="/admin">Admin</Link>
```
- Uygulama içi sayfaya gider
- `react-router-dom` kullanır

---

## 🎯 Önemli Notlar

1. **Desktop ve Mobil:** Her iki menüyü de güncellemeyi unutmayın
2. **ID Eşleşmesi:** `href="#about"` → Bölümde `id="about"` olmalı
3. **Icon Import:** Yeni icon kullanıyorsanız import ekleyin
4. **Stil Tutarlılığı:** Mevcut class'ları koruyun

---

## 🔍 Linkleri Bulma

**Grep ile arama:**
```bash
# Tüm href'leri bul
grep -r "href=" src/App.jsx

# Tüm Link componentlerini bul
grep -r "Link to=" src/
```

---

## 💡 İpuçları

- Link değişikliklerinden sonra sayfayı yenileyin
- Mobil menüyü de kontrol edin
- Dış linkler için `target="_blank"` kullanın
- Test edin: Tüm linkler çalışıyor mu?



