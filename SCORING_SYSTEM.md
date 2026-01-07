# 🏆 Puanlama ve Liderlik Tablosu Sistemi

## 📋 Sistem Gereksinimleri

### 1. Soru Yönetimi
- **Zorunlu Soru**: Her maç için "Bu maçı kim kazanır?" (otomatik oluşturulabilir)
- **Maça Özel Sorular**: İlk kill, en çok kill, 2. mapte ilk kill, vb.
- **Puan Sistemi**: Her soru için farklı puan değeri

### 2. Tahmin Alma
- İzleyiciler tahmin yapar (mevcut sistem)
- Chat'ten veya web'den

### 3. Doğru Cevap Girişi
- Yayın bitiminde admin doğru cevapları girer
- Her soru için doğru seçeneği seçer

### 4. Puan Hesaplama
- Doğru tahmin = Soru puanı
- Yanlış tahmin = 0 puan
- Toplam puan hesaplanır

### 5. Liderlik Tablosu
- Kullanıcılar puanlarına göre sıralanır
- Gerçek zamanlı güncelleme
- Zaman bazlı kapanma

---

## 🎯 Veri Yapısı

### Prediction (Soru)
```javascript
{
  id: "pred_123",
  question: "Bu maçı kim kazanır?",
  options: ["Team A", "Team B"],
  template: "match_winner",
  points: 10, // Bu soru için puan
  correctAnswer: null, // Yayın bitiminde girilecek
  isAnswered: false, // Doğru cevap girildi mi?
  matchId: "match_456", // Hangi maça ait
  isRequired: true, // Zorunlu soru mu?
  createdAt: "2024-01-15T10:00:00Z",
  closedAt: null, // Ne zaman kapandı
  votes: {
    "user1": 0, // user1 Team A seçti
    "user2": 1  // user2 Team B seçti
  }
}
```

### Match (Maç)
```javascript
{
  id: "match_456",
  team1: { name: "Eternal Fire", logo: "..." },
  team2: { name: "Sangal", logo: "..." },
  status: "finished", // upcoming, live, finished
  predictions: ["pred_123", "pred_124"], // Bu maça ait sorular
  createdAt: "2024-01-15T09:00:00Z"
}
```

### User Score (Kullanıcı Puanı)
```javascript
{
  userId: "user1",
  matchId: "match_456",
  predictions: {
    "pred_123": {
      answer: 0, // Hangi seçeneği seçti
      isCorrect: true, // Doğru mu?
      points: 10 // Kazandığı puan
    }
  },
  totalPoints: 10,
  rank: 1
}
```

### Leaderboard
```javascript
{
  matchId: "match_456",
  users: [
    { userId: "user1", totalPoints: 25, rank: 1 },
    { userId: "user2", totalPoints: 15, rank: 2 },
    { userId: "user3", totalPoints: 10, rank: 3 }
  ],
  closedAt: "2024-01-15T12:00:00Z" // Ne zaman kapandı
}
```

---

## 🔄 İş Akışı

### 1. Maç Başlangıcı
```
1. Admin maç bilgilerini girer
2. "Bu maçı kim kazanır?" sorusu otomatik oluşturulur (10 puan)
3. Admin maça özel sorular ekler (farklı puanlar)
4. Sistem açılır, tahminler alınmaya başlar
```

### 2. Yayın Sırasında
```
1. İzleyiciler tahmin yapar
2. Chat'ten veya web'den
3. Tahminler kaydedilir
4. Canlı sonuçlar gösterilir
```

### 3. Yayın Bitimi
```
1. Admin doğru cevapları girer
2. Her soru için doğru seçeneği seçer
3. Sistem otomatik puan hesaplar
4. Liderlik tablosu oluşturulur
```

### 4. Liderlik Tablosu
```
1. Kullanıcılar puanlarına göre sıralanır
2. Gerçek zamanlı güncelleme
3. Admin belirlediği zamanda kapatır
4. Final sıralama gösterilir
```

---

## 🛠️ Uygulama Adımları

### Adım 1: Soru Yapısını Güncelle
- `points` alanı ekle
- `correctAnswer` alanı ekle
- `isAnswered` alanı ekle
- `matchId` alanı ekle
- `isRequired` alanı ekle

### Adım 2: Maç Yönetimi
- Maç oluşturma
- Maça soru ekleme
- "Bu maçı kim kazanır?" otomatik oluşturma

### Adım 3: Doğru Cevap Girişi
- Admin panelinde doğru cevap girişi
- Her soru için doğru seçeneği seçme

### Adım 4: Puan Hesaplama
- Doğru tahmin kontrolü
- Puan hesaplama algoritması
- Toplam puan hesaplama

### Adım 5: Liderlik Tablosu
- Kullanıcı sıralaması
- Gerçek zamanlı güncelleme
- Zaman bazlı kapanma

---

## 📊 Örnek Senaryo

### Maç: Eternal Fire vs Sangal

**Sorular:**
1. Bu maçı kim kazanır? (10 puan) - Zorunlu
2. İlk kill'i kim alır? (5 puan)
3. En çok kill'i kim alır? (5 puan)
4. 2. mapte ilk kill? (3 puan)

**Tahminler:**
- User1: EF, EF, EF, EF
- User2: Sangal, EF, Sangal, Sangal
- User3: EF, Sangal, EF, EF

**Doğru Cevaplar (Admin girer):**
1. Eternal Fire
2. Eternal Fire
3. Eternal Fire
4. Sangal

**Puanlar:**
- User1: 10 + 5 + 5 + 0 = 20 puan
- User2: 0 + 5 + 0 + 3 = 8 puan
- User3: 10 + 0 + 5 + 0 = 15 puan

**Liderlik Tablosu:**
1. User1 - 20 puan
2. User3 - 15 puan
3. User2 - 8 puan

---

## 🎨 UI/UX Önerileri

### Admin Panel
- Maç oluşturma formu
- Soru ekleme (puan belirleme)
- Doğru cevap girişi
- Liderlik tablosu yönetimi

### Kullanıcı Sayfası
- Tahmin yapma
- Kendi puanını görme
- Liderlik tablosunu görme
- Geçmiş maç sonuçları

### Liderlik Tablosu
- Top 10 listesi
- Kendi sıralaması
- Puan detayları
- Zaman bazlı kapanma



