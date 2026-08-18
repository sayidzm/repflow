# Gym / Workout Tracking App — Project Goals

> Status: Onaylı MVP hedefleri  
> Belge sürümü: 1.0  
> Son güncelleme: 2026-08-18

## 1. Ana hedef

İnternet bağlantısı gerektirmeden çalışan, spor salonunda setler arasında hızlıca kullanılabilen ve kullanıcının antrenman geçmişini güvenilir biçimde koruyan stabil bir MVP üretmek.

MVP'nin amacı pazardaki tüm fitness uygulamalarıyla özellik sayısında yarışmak değildir. Amaç, temel workout kayıt döngüsünü çok iyi çalıştırmaktır.

## 2. MVP hedefi

Kullanıcı aşağıdaki tam döngüyü sorunsuz gerçekleştirebilmelidir:

```text
Workout başlat
→ Egzersiz ekle
→ Setleri kaydet
→ Workout'ı bitir
→ Geçmişi görüntüle
→ Egzersiz performansını incele
```

MVP kapsamındaki ana modüller:

- Egzersizler
- Routines
- Active Workout
- Workout History
- Basit Exercise Progress

## 3. Kullanıcı deneyimi hedefleri

- Active Workout ekranı tek elle kullanılabilmelidir.
- Set kaydetme akışı gereksiz ekran geçişi içermemelidir.
- Ağırlık, tekrar ve tamamla kontrolleri aynı bağlamda görünmelidir.
- Birincil eylemler belirgin ve büyük dokunma alanlarına sahip olmalıdır.
- Kullanıcı aktif workout'ını kaybetmekten endişe etmemelidir.
- Hata ve boş durum mesajları kullanıcıya ne yapacağını açıkça söylemelidir.
- Tasarım sade olmalı, fakat geçici veya özensiz görünmemelidir.

## 4. Performans hedefleri

- Uygulamanın temel yerel ekranları orta sınıf desteklenen bir cihazda hızlı açılmalıdır.
- Set tamamlama ve sayı güncelleme işlemleri algılanabilir gecikme oluşturmamalıdır.
- Tipik MVP veri hacminde veritabanı yazma ve okuma işlemleri hedef olarak 100 ms altında kalmalıdır; cihaz ve işlem koşullarına göre ölçülmelidir.
- Workout süresi uygulama arka plana geçtiğinde sapmamalıdır.
- Uzun geçmiş listeleri tüm veriyi tek seferde ekrana basmaya zorlanmamalıdır.

## 5. Kod kalitesi hedefleri

- TypeScript strict mode kullanılmalıdır.
- Domain modelleri açık ve tip güvenli olmalıdır.
- Ekran bileşenleri veri erişim ayrıntılarını bilmemelidir.
- Aynı işi yapan duplicate component veya helper oluşturulmamalıdır.
- Fonksiyon ve bileşenler tek, anlaşılır sorumluluğa sahip olmalıdır.
- Kritik domain kuralları UI içine dağılmamalıdır.
- Hatalar sessizce yutulmamalıdır.
- Lint, type-check ve test komutları proje içinde standartlaştırılmalıdır.

## 6. Bakım kolaylığı hedefleri

- Feature-based klasör yapısı kullanılmalıdır.
- Veritabanı migration'ları sıralı ve geri izlenebilir olmalıdır.
- Büyük kararların gerekçesi `memory-bank/decisions.md` içinde tutulmalıdır.
- Projenin güncel gerçeği `memory-bank/current-state.md` ile takip edilmelidir.
- Her geliştirme sonunda ilgili dokümantasyon güncellenmelidir.
- Bir özellik kaldırıldığında veya değiştiğinde eski açıklamalar aktif belge içinde bırakılmamalıdır.

## 7. Ölçeklenebilirlik hedefleri

MVP backend içermese de mimari şu genişlemeleri engellememelidir:

- Cloud sync
- Hesap sistemi
- Veri export/import
- Health platform entegrasyonları
- Gelişmiş workout türleri
- Grafik ve analytics

Bu hedefler MVP'de bu özellikler için kod yazılacağı anlamına gelmez. Yalnızca UI, domain ve veri erişimi arasındaki sınırlar gelecekteki değişiklikleri kolaylaştıracak kadar temiz tutulur.

## 8. Veri güvenilirliği hedefleri

- Her anlamlı active workout değişikliği yerel veritabanına kaydedilmelidir.
- Birden çok tabloyu etkileyen işlemler transaction içinde yapılmalıdır.
- Foreign key kontrolleri etkin olmalıdır.
- Eski workout kayıtları egzersiz adı değişikliklerinden etkilenmemelidir.
- Kullanılmış egzersizler hard delete ile geçmişten koparılmamalıdır.
- Migration uygulanmadan şema değiştirilmemelidir.
- Kullanıcıya kayıt başarılı görünürken veri yazma işlemi başarısız kalmamalıdır.

## 9. Offline-first hedefi

- MVP'nin bütün temel özellikleri ağ bağlantısı olmadan çalışmalıdır.
- SQLite kalıcı verinin ana kaynağı olmalıdır.
- Ağ durumu temel navigasyonu veya workout kaydını etkilememelidir.
- Active workout yalnız in-memory state'e bağlı olmamalıdır.
- Cloud sync için şimdiden backend, kimlik doğrulama veya conflict-resolution sistemi kurulmayacaktır.

## 10. Genişletilebilir mimari hedefi

Ana prensip:

> Build for today's MVP, structure for tomorrow's growth.

Bunun anlamı:

- Bugün kullanılmayan soyutlamalar eklenmez.
- UI doğrudan kalıcı veri katmanına bağlanmaz.
- Repository ve use-case sınırları gerçek ihtiyaç kadar kullanılır.
- Yeni özellikler mevcut feature modüllerini gereksiz yere yeniden yazmadan eklenebilmelidir.
- Üçüncü taraf kütüphaneler kolaylık sağladığı için değil, ölçülebilir bir ihtiyacı çözdüğü için eklenir.

## 11. MVP dışı teknik hedefler

İlk sürümde hedeflenmeyenler:

- Mikroservis veya ayrı backend
- Monorepo
- Genel amaçlı plugin sistemi
- Çok kullanıcılı yetkilendirme
- Gerçek zamanlı senkronizasyon
- Event sourcing
- Gereksiz generic repository veya kapsamlı domain framework'ü
- Her olası geleceğe göre önceden hazırlanmış tablolar

## 12. Tamamlanma tanımı

Bir görev tamamlanmış sayılmadan önce:

1. Kabul kriterleri karşılanmalıdır.
2. İlgili testler geçmelidir.
3. Mevcut kritik akışlarda regresyon kontrolü yapılmalıdır.
4. Type-check ve lint hatası bulunmamalıdır.
5. `current-state.md` ve `progress.md` güncellenmelidir.
6. Yeni teknik karar varsa `decisions.md` güncellenmelidir.
7. Dokümantasyon gerçek uygulama davranışıyla uyumlu olmalıdır.
