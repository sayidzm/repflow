# Architecture

> Durum: Accepted, henüz uygulanmadı  
> Son güncelleme: 2026-08-18

## 1. Mimari hedef

MVP için sade, modüler, test edilebilir ve offline-first bir yapı kurmak; gelecekteki cloud sync veya gelişmiş analytics özelliklerini mümkün kılarken bugünden kullanılmayan altyapılar oluşturmamak.

## 2. Teknoloji yığını

| Alan | Karar |
| --- | --- |
| Mobil framework | React Native + Expo |
| Dil | TypeScript, strict mode |
| Navigasyon | Expo Router |
| Yerel veritabanı | Expo SQLite |
| Kalıcı veri modeli | İlişkisel SQLite tabloları |
| UI durumu | React hooks |
| Active Workout koordinasyonu | Sınırlı Context + `useReducer` |
| Veri erişimi | Feature odaklı repository'ler |
| Test | Jest, `jest-expo`, React Native Testing Library |
| Stil | Design tokens + React Native `StyleSheet` tabanlı shared UI |

## 3. Katmanlar

```text
Route / Screen
↓
Feature component ve hook'ları
↓
Use-case / domain servisleri
↓
Repository arayüzleri
↓
SQLite implementation
```

### 3.1 Route / Screen

Sorumlulukları:

- Navigasyon parametreleri
- Ekran yerleşimi
- Kullanıcı etkileşimini feature katmanına iletmek
- Loading, empty ve error durumlarını göstermek

Yapmaması gerekenler:

- SQL sorgusu çalıştırmak
- Birden fazla tabloya ait iş kurallarını yönetmek
- Kalıcı veri formatını doğrudan bilmek

### 3.2 Feature katmanı

Her özellik kendi bileşen, hook, tip ve testlerini barındırır:

- `exercises`
- `routines`
- `workouts`
- `history`
- `progress`

Feature katmanı UI ile domain/use-case davranışı arasındaki koordinasyonu yapar.

### 3.3 Domain / use-case katmanı

Örnek sorumluluklar:

- Yeni workout başlatma kuralları
- Aynı anda tek aktif workout kuralı
- Workout bitirme doğrulaması
- Routine'den workout üretme
- Ağırlık ve tekrar doğrulaması
- Egzersiz arşivleme kararı
- Süre hesaplama

### 3.4 Repository katmanı

Planlanan repository sınırları:

- `ExerciseRepository`
- `RoutineRepository`
- `WorkoutRepository`
- `HistoryRepository`
- `ProgressRepository`
- `SettingsRepository`

Repository'ler domain modelleri döndürür. Ekranlar SQLite row biçimlerine bağımlı olmaz.

### 3.5 SQLite katmanı

Sorumlulukları:

- Veritabanı açılışı
- `PRAGMA foreign_keys = ON`
- WAL journal mode
- Sıralı migration çalıştırma
- Parametreli sorgular
- Transaction yönetimi
- Seed egzersiz verisi

## 4. State yönetimi

### Kalıcı state

SQLite ana veri kaynağıdır:

- Exercises
- Routines
- Active workout
- Workout history
- Workout sets
- App settings

### Geçici UI state

React hook'larında tutulabilir:

- Açık/kapalı modal durumu
- Geçici filtre metni
- Odaklanmış input
- Yükleme ve ekran hata durumu

### Active Workout state

- Context + `useReducer`, ekranlar arasındaki aktif session etkileşimini koordine eder.
- Her anlamlı değişiklik SQLite'a yazılır.
- Context tek başına source of truth değildir.
- Uygulama başlangıcında aktif workout repository üzerinden yüklenir.

## 5. Zaman ve süre yönetimi

- `started_at` kalıcı olarak saklanır.
- Ekrandaki süre `now - started_at` üzerinden türetilir.
- Uygulama arka plana geçtiğinde sayaç yazmaya devam etmez.
- Workout tamamlandığında `ended_at` saklanır.
- `duration_seconds`, tamamlanma anında deterministik olarak hesaplanır ve snapshot olarak tutulur.

## 6. Offline-first yaklaşım

- MVP'de network client gerekli değildir.
- Veri yazmaları cihaz üzerindeki SQLite'a yapılır.
- Ağ durumu UI akışlarını engellemez.
- Gelecekte senkronizasyon eklenirse repository implementation değişebilir; mevcut UI aynı domain modellerini kullanmaya devam eder.
- Sync metadata alanları gerçek bir sync tasarımı onaylanmadan şemaya eklenmez.

## 7. Transaction sınırları

Aşağıdaki işlemler transaction kullanmalıdır:

- Routine'den workout ve workout exercise kayıtları üretmek
- Workout'ı completed durumuna geçirmek
- Egzersiz ve bağlı başlangıç seti eklemek
- Sıralama güncellemesini birden fazla satıra uygulamak
- Routine ve routine exercise kayıtlarını birlikte değiştirmek

## 8. Hata yönetimi

- Veri katmanı tanımlı repository/domain hataları üretir.
- UI, teknik SQLite mesajını doğrudan göstermez.
- Yazma başarısızsa optimistic başarı durumu kalıcılaştırılmaz.
- Kritik hatalar retry veya güvenli geri dönüş eylemi sunar.
- Hata logları kullanıcı verisini gereksiz biçimde içermemelidir.

## 9. Planlanan klasör yapısı

```text
app/
├── _layout.tsx
├── index.tsx
├── exercises/
├── routines/
├── workout/
├── history/
└── progress/

src/
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── exercises/
│   ├── routines/
│   ├── workouts/
│   ├── history/
│   └── progress/
├── database/
│   ├── migrations/
│   ├── repositories/
│   ├── schema/
│   └── seed/
├── domain/
│   ├── models/
│   ├── validation/
│   └── errors/
├── providers/
├── theme/
├── hooks/
└── utils/

__tests__/
assets/
memory-bank/
```

## 10. Component sistemi

İlk ortak UI bileşen adayları:

- Button
- IconButton
- TextInput / NumericInput
- Card
- Screen
- EmptyState
- ErrorState
- ConfirmDialog
- ListRow
- StatusBadge

Yalnız iki veya daha fazla gerçek kullanım görüldüğünde ortaklaştırma yapılır. Feature'a özgü `WorkoutSetRow` ve `ExercisePickerRow` gibi bileşenler kendi feature klasöründe kalır.

## 11. Performans yaklaşımı

- Geçmiş sorguları indeksli ve sınırlı sonuçlarla çalışır.
- Ekranlar gerekenden fazla ilişkisel veri yüklemez.
- Set satırları kararlı kimlikler kullanır.
- Büyük listeler uygun liste bileşeniyle render edilir.
- Gereksiz global state update'leri önlenir.
- Optimizasyon yalnız ölçülen soruna göre yapılır.

## 12. Bilinçli olarak seçilmeyen yapılar

MVP başlangıcında kullanılmayacak:

- Backend
- ORM
- Redux/Zustand benzeri global state dependency'si
- Genel amaçlı dependency injection container
- Event sourcing
- Monorepo
- Mikroservis
- Kapsamlı UI framework'ü

Gerçek ihtiyaç oluşursa yeni karar kaydı ve kullanıcı onayıyla tekrar değerlendirilebilir.
