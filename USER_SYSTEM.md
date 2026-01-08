# 👤 Kullanıcı Sistemi ve Liderlik Tablosu

## 📋 Sistem Gereksinimleri

### 1. Kullanıcı Kayıt/Giriş
- Kullanıcı adı veya e-posta ile kayıt
- Şifre ile giriş
- Basit ve hızlı (yayın sırasında kullanım için)

### 2. Kullanıcı Profili
- Kullanıcı adı
- Toplam puan
- Sıralama
- Geçmiş tahminler

### 3. Liderlik Tablosu
- Top 10/20/50 listesi
- Kendi sıralaması
- Puan detayları
- Gerçek zamanlı güncelleme

---

## 🎯 Veri Yapısı

### User (Kullanıcı)
```javascript
{
  id: "user_123",
  username: "gamer123",
  email: "gamer@example.com", // Opsiyonel
  password: "hashed_password", // Şifre hash
  createdAt: "2024-01-15T10:00:00Z",
  totalPoints: 45,
  rank: 5
}
```

### User Score (Kullanıcı Puanı)
```javascript
{
  userId: "user_123",
  matchId: "match_456",
  predictions: {
    "pred_123": {
      answer: 0, // Hangi seçeneği seçti
      isCorrect: true, // Doğru mu?
      points: 10 // Kazandığı puan
    }
  },
  totalPoints: 10
}
```

### Leaderboard (Liderlik Tablosu)
```javascript
{
  matchId: "match_456",
  users: [
    { userId: "user_1", username: "gamer1", totalPoints: 25, rank: 1 },
    { userId: "user_2", username: "gamer2", totalPoints: 20, rank: 2 },
    { userId: "user_3", username: "gamer3", totalPoints: 15, rank: 3 }
  ],
  updatedAt: "2024-01-15T12:00:00Z"
}
```

---

## 🔄 İş Akışı

### 1. Kullanıcı Kayıt
```
1. Kullanıcı kayıt sayfasına gider
2. Kullanıcı adı ve şifre girer
3. Kayıt olur
4. Otomatik giriş yapar
```

### 2. Tahmin Yapma
```
1. Kullanıcı giriş yapmış olmalı
2. Soruları görür
3. Tahmin yapar
4. Puan kazanır (doğru cevap sonrası)
```

### 3. Liderlik Tablosu
```
1. Kullanıcı liderlik tablosunu görür
2. Kendi sıralamasını görür
3. Top 10/20/50 listesini görür
4. Gerçek zamanlı güncelleme
```

---

## 🛠️ Uygulama Adımları

### Adım 1: Kullanıcı Kayıt/Giriş Sistemi
- Kayıt sayfası
- Giriş sayfası
- localStorage'da kullanıcı verileri
- Session yönetimi

### Adım 2: Kullanıcı Profili
- Profil sayfası
- Toplam puan
- Sıralama
- Geçmiş tahminler

### Adım 3: Liderlik Tablosu
- Liderlik tablosu sayfası
- Top 10/20/50 listesi
- Kendi sıralaması
- Gerçek zamanlı güncelleme

### Adım 4: Puan Hesaplama
- Doğru tahmin kontrolü
- Puan hesaplama
- Toplam puan güncelleme

---

## 🎨 UI/UX Önerileri

### Kayıt/Giriş Sayfası
- Basit form
- Hızlı kayıt
- Hata mesajları

### Liderlik Tablosu
- Top 10 listesi (büyük kartlar)
- Kendi sıralaması (vurgulu)
- Puan detayları
- Animasyonlar

### Kullanıcı Profili
- Toplam puan
- Sıralama
- Geçmiş tahminler
- İstatistikler




