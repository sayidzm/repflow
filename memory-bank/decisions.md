# Technical Decisions

> Son güncelleme: 2026-08-18

Bu dosya önemli ürün ve teknik kararların geçmişini tutar. Kabul edilmiş bir karar değiştiğinde eski kayıt silinmez; `Superseded` olarak işaretlenir ve yeni karar kimliğine bağlanır.

## Karar özeti

| Kimlik | Karar | Durum | Tarih |
| --- | --- | --- | --- |
| DEC-001 | React Native + Expo + TypeScript kullanımı | Accepted | 2026-08-18 |
| DEC-002 | Expo Router ile dosya tabanlı navigasyon | Accepted | 2026-08-18 |
| DEC-003 | Expo SQLite ile offline-first persistence | Accepted | 2026-08-18 |
| DEC-004 | MVP'de backend, hesap ve cloud sync bulunmaması | Accepted | 2026-08-18 |
| DEC-005 | SQLite'ın source of truth olması | Accepted | 2026-08-18 |
| DEC-006 | ORM ve global state dependency'sinin başlangıçta kullanılmaması | Accepted | 2026-08-18 |
| DEC-007 | Feature-based proje yapısı ve repository sınırları | Accepted | 2026-08-18 |
| DEC-008 | Workout history için snapshot alanları | Accepted | 2026-08-18 |
| DEC-009 | Kullanılmış egzersizlerde hard delete yerine arşivleme | Accepted | 2026-08-18 |
| DEC-010 | Routine'in MVP'de yalnız sıralı egzersiz listesi taşıması | Accepted | 2026-08-18 |
| DEC-011 | Progress'in grafik yerine tarihsel set listesi olması | Accepted | 2026-08-18 |
| DEC-012 | Workout süresinin timestamp üzerinden hesaplanması | Accepted | 2026-08-18 |
| DEC-013 | Phase 1B Tasarım Entegrasyonu ve yerel draft state kullanımı | Accepted | 2026-08-18 |
| DEC-014 | Web platformunda SQLite yerine in-memory fallback | Accepted | 2026-08-18 |

---

## DEC-014 — Web platformunda SQLite yerine in-memory fallback

- Tarih: 2026-08-18
- Durum: Accepted

### Bağlam
Expo SQLite yalnız native platformlarda (iOS/Android) çalışır. Web tarayıcısında `SQLiteProvider` desteklenmez ve `useSQLiteContext()` boş kalır. Kullanıcı web üzerinde `expo start` ile test ederken workout kaydetme ve rutin oluşturma hataları veriyordu.

### Karar
Web'de `useRoutines` (create/update/delete) ve `WorkoutDraftProvider.finishWorkout` SQLite yerine in-memory state ile çalışır. Hata fırlatmak yerine memory fallback kullanılır. Native'de mevcut SQLite repository flow'u korunur.

### Gerekçe
- Web, geliştirme ve UI doğrulaması için kullanıcı tarafından tercih ediliyor.
- İn-memory fallback, web'de uygulamanın akışını test edilebilir kılar.
- Kalıcılık (IndexedDB gibi web storage) MVP kapsamı dışındadır; gerekirse ayrı karar ile eklenir.

### Sonuçlar
- Web'de veriler session boyunca in-memory tutulur; sayfa yenilenince kaybolur.
- Native platformlar etkilenmez; SQLite source of truth kuralı (DEC-005) korunur.
- Web'de kalıcı veri gereksinimi oluşursa DEC-014 yeniden değerlendirilir.

---

## DEC-013 — Phase 1B Tasarım Entegrasyonu ve yerel draft state kullanımı

- Tarih: 2026-08-18
- Durum: Accepted

### Bağlam
Referans tasarımındaki 6 ekranın Phase 1 temelinde React Native + Expo Router'a taşınması istendi. Gerçek SQLite persistence Phase 2/3 kapsamındadır.

### Karar
Phase 1B'de ekranlar Expo Router typed route'larına bağlandı. Active Workout ve Exercise Selector etkileşimleri `WorkoutDraftProvider` in-memory context state'i ile aktifleştirildi.

### Gerekçe
Tasarım dilini erken doğrulamak ve kullanıcı etkileşimlerini UI katmanında test edebilmek.

### Sonuçlar
- UI state SQLite persistence'a bağlanana kadar geçicidir ve kullanıcıya sahte kalıcılık gösterilmez.


---

## DEC-001 — React Native + Expo + TypeScript

- Tarih: 2026-08-18
- Durum: Accepted

### Bağlam

Uygulamanın Android ve iOS üzerinde çalışması, hızlı MVP geliştirilmesi ve tip güvenli bir kod tabanı oluşturulması amaçlanıyor.

### Karar

React Native, Expo ve TypeScript strict mode kullanılacak.

### Gerekçe

- Tek kod tabanıyla iki mobil platform
- Expo ekosisteminde yerel SQLite ve navigasyon desteği
- TypeScript ile domain ve repository sınırlarında tip güvenliği
- MVP için native proje ayrıntılarını gereksiz yere büyütmemesi

### Sonuçlar

- Platforma özgü davranışlar gerçek cihazlarda ayrıca test edilmelidir.
- Native dependency eklenirse development build gereksinimi değerlendirilmelidir.

---

## DEC-002 — Expo Router

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Navigasyon Expo Router ile dosya tabanlı kurulacak.

### Gerekçe

- Route yapısının proje ağacında görünür olması
- Typed route ve deep-link genişlemesine uygunluk
- Expo ile doğrudan uyum

### Sonuçlar

- Test dosyaları `app/` dizinine konulmayacak.
- Route dosyaları ince tutulacak; iş mantığı feature katmanında kalacak.

---

## DEC-003 — Expo SQLite

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Temel veriler Expo SQLite ile cihazda saklanacak.

### Gerekçe

- Workout, exercise, routine ve setler doğal olarak ilişkisel veri oluşturur.
- Uygulama yeniden başlatıldığında verinin kalıcı olması gerekir.
- Geçmiş ve progress sorguları ilişkisel sorgularla güvenilir üretilebilir.

### Sonuçlar

- Migration sistemi ilk şemadan itibaren kurulmalıdır.
- Foreign key ve transaction davranışı açıkça yönetilmelidir.

---

## DEC-004 — MVP'de backend yok

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

MVP backend, kullanıcı hesabı, kimlik doğrulama veya cloud sync içermeyecek.

### Gerekçe

Ana değer, tek cihazda hızlı ve güvenilir workout kaydıdır. Backend ilk sürümün riskini ve geliştirme süresini gereksiz artırır.

### Sonuçlar

- Cihazlar arası veri aktarımı yoktur.
- Uygulama silinirse veri kaybı riski, backup/export özelliği eklenene kadar devam eder ve gelecekte kullanıcıya açıkça anlatılmalıdır.

---

## DEC-005 — SQLite source of truth

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

SQLite kalıcı verinin tek ana kaynağıdır. Active Workout context'i yalnız koordinasyon ve hızlı UI güncellemesi sağlar.

### Gerekçe

Active workout'ın uygulama kapanması veya işletim sistemi tarafından sonlandırılması halinde kaybolmaması gerekir.

### Sonuçlar

- Her anlamlı workout değişikliği kalıcı yazma ile eşlenir.
- UI başarı durumunu veri yazma sonucuyla uyumlu tutmalıdır.

---

## DEC-006 — Başlangıçta ORM ve global state kütüphanesi yok

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

İlk MVP temelinde ORM ve Redux/Zustand benzeri ek global state dependency'si kullanılmayacak.

### Gerekçe

Mevcut veri modeli doğrudan SQLite repository'leriyle yönetilebilir. Global uygulama state'i sınırlıdır.

### Sonuçlar

- SQL ve row mapping kodu repository katmanında açıkça yazılır.
- Karmaşıklık ölçülebilir biçimde artarsa yeni karar kaydıyla yeniden değerlendirilir.

---

## DEC-007 — Feature-based yapı

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Kod `exercises`, `routines`, `workouts`, `history` ve `progress` feature'ları etrafında organize edilecek. Ortak altyapı ayrı `database`, `domain`, `components` ve `theme` klasörlerinde tutulacak.

### Gerekçe

Feature'a ait UI, hook ve testlerin birlikte bulunması bakım kolaylığını artırır; tek bir büyük screens dosyası oluşmasını önler.

### Sonuçlar

- Feature sınırları arasında doğrudan iç dosya import'u yapılmamalıdır.
- Gerçekten ortak olmayan bileşen shared klasörüne taşınmamalıdır.

---

## DEC-008 — Workout snapshot alanları

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Workout exercise kaydında egzersiz adı ve kas grubu snapshot olarak saklanacak.

### Gerekçe

Egzersiz sonradan yeniden adlandırıldığında eski workout geçmişinin değişmemesi gerekir.

### Sonuçlar

- Bir miktar tekrarlı veri oluşur.
- Geçmiş kayıtları daha güvenilir ve bağımsız okunur.

---

## DEC-009 — Egzersiz arşivleme

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Geçmişte kullanılmış egzersizler hard delete edilmez; `archived_at` ile arşivlenir.

### Gerekçe

Referans bütünlüğü ve geçmiş performansın korunması gerekir.

### Sonuçlar

- Egzersiz seçici varsayılan olarak arşivlenmiş kayıtları gizler.
- Routine içindeki arşivli egzersizler sessizce yok sayılmaz; kullanıcıya gösterilir.

---

## DEC-010 — Minimal routine modeli

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

MVP routine'i ad ve sıralı egzersiz listesi taşır. Hedef set, tekrar aralığı, RPE, rest veya teknik set türleri taşımaz.

### Gerekçe

Routine'in temel değeri, sık kullanılan egzersizleri workout'a hızlı eklemektir. Daha ayrıntılı programlama MVP'yi gereksiz büyütür.

### Sonuçlar

- Routine başlatıldığında her egzersiz için bir boş set oluşturulur.
- Kullanıcı set sayısını active workout'ta belirler.

---

## DEC-011 — Liste tabanlı progress

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

MVP progress ekranı tarihsel tamamlanmış set listesini ve workout başına en ağır set özetini gösterir; grafik veya 1RM hesaplamaz.

### Gerekçe

Kullanıcı temel gelişimi görebilirken analytics kapsamı MVP dışında kalır.

### Sonuçlar

- Özet değer PR olarak adlandırılmaz.
- Gelişmiş analytics sonraki roadmap kararına bırakılır.

---

## DEC-012 — Timestamp tabanlı süre

- Tarih: 2026-08-18
- Durum: Accepted

### Karar

Workout süresi `started_at` ve `ended_at` zaman damgalarından hesaplanacak; her saniye kalıcı sayaç değeri artırılmayacak.

### Gerekçe

Uygulama arka planda veya kapalıyken süre sapmasını ve gereksiz yazma işlemlerini önler.

### Sonuçlar

- Cihaz saatindeki kullanıcı değişiklikleri süreyi etkileyebilir; uygulama davranışı test edilmelidir.
