<div align="center">

# RepFlow

### Android ve iOS için offline-first antrenman takip uygulaması.

**Setler arasında ağırlık × tekrar bilgilerini hızlıca kaydet. Geçmişini güvenilir şekilde sakla. Hesap yok, internet yok, dikkat dağıtıcı hiçbir şey yok.**

<br />

<img src="https://img.shields.io/badge/Expo%20SDK-57-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" />
<img src="https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native 0.86" />
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript strict" />
<img src="https://img.shields.io/badge/Expo%20SQLite-local-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="Expo SQLite" />
<img src="https://img.shields.io/badge/platform-Android%20%7C%20iOS-808080?style=for-the-badge" alt="Platform" />
<img src="https://img.shields.io/badge/version-1.0.0-4C1D95?style=for-the-badge" alt="Version" />

<br />

[![GitHub stars](https://img.shields.io/github/stars/sayidzm/repflow?style=for-the-badge&logo=github&label=stars)](https://github.com/sayidzm/repflow)
[![GitHub last commit](https://img.shields.io/github/last-commit/sayidzm/repflow?style=for-the-badge&logo=github)](https://github.com/sayidzm/repflow)

</div>

---

## 📖 Genel Bakış

RepFlow, spor salonunda set kaydetme işlemini mümkün olduğunca hızlı hale getirmek için geliştirilmiş **local-first bir ağırlık antrenmanı takip uygulamasıdır**.

Temel fikir oldukça basittir:

> Spor salonunda bir set kaydetmek, telefondaki not uygulamasına yazmaktan daha zor olmamalıdır. Ayrıca kaydettiğin veriler ertesi gün de güvenilir şekilde orada olmalıdır.

Çoğu spor uygulaması iki uç noktadan birinde yer alır:

- Kağıt veya not uygulamaları hızlıdır ancak geçmiş antrenmanları karşılaştırmak zordur.
- Büyük fitness uygulamaları ise çok fazla özellikle doludur ve setler arasında kullanmak gereksiz derecede karmaşıktır.

RepFlow bilinçli olarak küçük, hızlı ve odaklanmış tutulmuştur.

- **Hızlı kayıt** — ağırlık, tekrar ve tamamlandı kontrolü aynı satırda bulunur.
- **Güvenilir veri** — önemli her değişiklik gerçekleştiği anda cihazdaki SQLite veritabanına yazılır.
- **Basit ilerleme takibi** — her egzersiz için tarih bazlı set geçmişi gösterilir. Gereksiz grafik veya karmaşa yoktur.

> **Ürün prensibi:** Kullanıcı antrenman sırasında uygulamayla uğraşmamalı; uygulama antrenmanı kaydetmeyi kolaylaştırmalıdır.

RepFlow tasarım gereği **offline-first**, tek kullanıcılı ve tek cihazlı bir uygulamadır.

Uygulamada:

- Backend yoktur.
- Hesap sistemi yoktur.
- Cloud sync yoktur.
- İnternet bağlantısı gerektiren temel bir özellik yoktur.

MVP'nin tamamı internet bağlantısı olmadan çalışabilir.

**Mevcut durum:** MVP şu anda **Release Candidate** aşamasındadır.

Kod tarafındaki temel doğrulamalar tamamlanmıştır:

- TypeScript type-check
- ESLint
- 61 otomatik test
- `expo-doctor`
- Web export
- Android prebuild

Son gerçek cihaz kontrolleri ve kullanıcı geri bildirimleri henüz tamamlanmamıştır.

---

## ✨ Özellikler

### Temel Antrenman Deneyimi

- **Aktif antrenman** — dikkat dağıtmayan, tam ekran antrenman oturumu.
- **Canlı süre takibi** — antrenman süresi timestamp verileri üzerinden hesaplanır.
- **Set kaydı** — ağırlık ve tekrar girişleri ile set tamamlama kontrolü aynı satırda bulunur.
- **Akıllı yeni set** — yeni oluşturulan set, önceki setin ağırlık ve tekrar değerlerini otomatik olarak devralır.
- **Tek aktif antrenman kuralı** — veritabanı aynı anda yalnızca bir aktif antrenman bulunmasına izin verir.
- **Crash-safe recovery** — uygulama antrenmanın ortasında kapatılsa bile aktif oturum SQLite üzerinden tekrar yüklenir.

---

### Egzersizler

RepFlow içerisinde varsayılan olarak **229 egzersiz** bulunur.

Egzersizler 6 kas grubuna ayrılmıştır:

- `Chest`
- `Back`
- `Legs`
- `Shoulders`
- `Arms`
- `Core`

Ayrıca 6 ekipman/kategori türü bulunur:

- `Barbell`
- `Dumbbell`
- `Machine`
- `Cable`
- `Bodyweight`
- `Other`

Diğer özellikler:

- **İsimle arama**
- **Kas grubuna göre filtreleme**
- Büyük listelerde performans için deferred input kullanımı
- **Özel egzersiz oluşturma**
- Özel egzersizleri düzenleme
- Egzersizleri arşivleme
- Kullanılmış egzersizlerin geçmişi korumak için tamamen silinmemesi

### Arşivleme Sistemi

Geçmiş antrenmanlarda kullanılmış bir egzersiz hard-delete yöntemiyle kaldırılmaz.

Bunun yerine arşivlenir.

Bu sayede eski antrenman kayıtları bozulmaz.

---

### Rutinler

RepFlow içerisinde tekrar kullanılabilir antrenman rutinleri oluşturulabilir.

Kullanıcı:

- Rutin oluşturabilir.
- Rutini düzenleyebilir.
- Rutini silebilir.
- Egzersizleri belirli bir sıraya göre ekleyebilir.
- Tek dokunuşla rutinden antrenman başlatabilir.

Bir rutin başlatıldığında egzersizler aktif antrenmana belirlenen sırayla otomatik olarak eklenir.

Her rutin ayrıca en son gerçekleştirildiği tarihi gösterir.

---

### Geçmiş ve İlerleme

Tamamlanan antrenmanlar ters kronolojik sırayla görüntülenir.

Antrenmanlar günlere göre gruplanır.

Örneğin:

```text
BUGÜN

DÜN

12 AĞUSTOS 2026
