# Data Model

> Durum: MVP için onaylı tasarım, uygulandı (`001_initialSchema` migration)  
> Son güncelleme: 2026-08-18

## 1. Genel kurallar

- Veritabanı: SQLite
- Kimlikler: Uygulama tarafından üretilen benzersiz `TEXT` kimlikler
- Zaman damgaları: Unix epoch milliseconds, `INTEGER`
- Boolean değerler: `INTEGER`, yalnızca `0` veya `1`
- Ağırlık: `REAL`, negatif olamaz
- Tekrar: `INTEGER`, negatif olamaz
- Sıra alanları: sıfırdan veya birden başlayan tek bir proje standardı seçilip bütün tablolarda tutarlı uygulanmalıdır
- Bütün kullanıcı girdileri parametreli sorgularla yazılmalıdır
- Foreign key kontrolü veritabanı açılışında etkinleştirilmelidir

## 2. İlişki özeti

```text
exercises
├── routine_exercises → routines
└── workout_exercises → workouts
                         └── workout_sets
```

## 3. Tablolar

### 3.1 `exercises`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `name` | TEXT | Not null, trim sonrası boş olamaz |
| `muscle_group` | TEXT | Not null, kontrollü domain değeri |
| `category` | TEXT | Not null, kontrollü domain değeri |
| `is_custom` | INTEGER | Not null, 0/1 |
| `created_at` | INTEGER | Not null |
| `updated_at` | INTEGER | Not null |
| `archived_at` | INTEGER | Nullable |

Kurallar:

- Hazır egzersiz `is_custom = 0`, kullanıcı egzersizi `is_custom = 1` taşır.
- Arşivlenmiş egzersiz yeni seçim listelerinde varsayılan olarak gösterilmez.
- Geçmişte kullanılmış egzersiz hard delete edilmez.
- İsim eşsizliği case-insensitive ve trim edilmiş değer üzerinden uygulama/repository katmanında kontrol edilir.

### 3.2 `routines`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `name` | TEXT | Not null, boş olamaz |
| `created_at` | INTEGER | Not null |
| `updated_at` | INTEGER | Not null |

### 3.3 `routine_exercises`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `routine_id` | TEXT | FK → `routines.id`, cascade delete |
| `exercise_id` | TEXT | FK → `exercises.id`, restrict delete |
| `sort_order` | INTEGER | Not null, sıfır veya pozitif |

Kısıtlar:

- Aynı routine içinde `sort_order` benzersiz olmalıdır.
- MVP'de aynı egzersizin bir routine içinde yalnız bir kez bulunması tercih edilir ve unique constraint ile korunur.
- Routine silindiğinde bağlantı satırları silinir; exercise silinmez.
- Routine egzersizleri varsayılan set, RPE, rest veya hedef tekrar taşımaz.

### 3.4 `workouts`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `routine_id` | TEXT | Nullable FK → `routines.id`, delete sonrası null |
| `name` | TEXT | Not null |
| `status` | TEXT | `active`, `completed` veya `cancelled` |
| `started_at` | INTEGER | Not null |
| `ended_at` | INTEGER | Nullable; completed/cancelled için dolu |
| `duration_seconds` | INTEGER | Nullable; negatif olamaz |
| `created_at` | INTEGER | Not null |
| `updated_at` | INTEGER | Not null |

Kurallar:

- Veritabanında aynı anda en fazla bir `active` workout bulunur.
- Bu kural destekleniyorsa partial unique index, değilse transaction içindeki repository kontrolü ile korunur.
- Workout süresi `ended_at - started_at` üzerinden hesaplanır.
- Routine silinse bile workout ve workout içeriği korunur.
- Cancelled workout normal geçmiş listesinde gösterilmez.

### 3.5 `workout_exercises`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `workout_id` | TEXT | FK → `workouts.id`, cascade delete |
| `exercise_id` | TEXT | Nullable FK → `exercises.id`, delete sonrası null |
| `exercise_name_snapshot` | TEXT | Not null |
| `muscle_group_snapshot` | TEXT | Not null |
| `sort_order` | INTEGER | Not null, sıfır veya pozitif |
| `created_at` | INTEGER | Not null |

Snapshot gerekçesi:

- Egzersizin adı veya kas grubu sonradan değişse bile tamamlanmış workout geçmişi değişmez.
- Egzersiz kaydı ileride kaldırılmış olsa bile geçmiş okunabilir kalır.

Kısıtlar:

- Aynı workout içinde `sort_order` benzersiz olmalıdır.
- MVP'de aynı egzersiz workout içinde yalnız bir kez bulunur.

### 3.6 `workout_sets`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `workout_exercise_id` | TEXT | FK → `workout_exercises.id`, cascade delete |
| `sort_order` | INTEGER | Not null, sıfır veya pozitif |
| `weight` | REAL | Nullable taslakta; doluysa negatif olamaz |
| `reps` | INTEGER | Nullable taslakta; doluysa negatif olamaz |
| `is_completed` | INTEGER | Not null, 0/1 |
| `completed_at` | INTEGER | Nullable |
| `created_at` | INTEGER | Not null |
| `updated_at` | INTEGER | Not null |

Kurallar:

- `is_completed = 1` için weight ve reps geçerli sayısal değerler olmalıdır.
- Bir set tamamlandığında `completed_at` yazılır.
- Set tekrar tamamlanmamış duruma getirilirse `completed_at` temizlenir.
- Aynı workout exercise içinde `sort_order` benzersiz olmalıdır.
- Weight değeri MVP'de kilogram olarak yorumlanır.

### 3.7 `app_settings`

| Alan | SQLite tipi | Kural |
| --- | --- | --- |
| `id` | INTEGER | Primary key, sabit değer `1` |
| `weight_unit` | TEXT | MVP varsayılanı `kg` |
| `created_at` | INTEGER | Not null |
| `updated_at` | INTEGER | Not null |

MVP'de yalnız `kg` kullanılır. `lb` desteği ayrı bir kapsam kararıyla eklenir; veri dönüştürme davranışı belirlenmeden sadece UI seçeneği eklenmez.

## 4. Önerilen indeksler

- `exercises(name COLLATE NOCASE)`
- `exercises(muscle_group, archived_at)`
- `routine_exercises(routine_id, sort_order)` unique
- `workouts(status)`
- `workouts(started_at DESC)`
- `workout_exercises(workout_id, sort_order)` unique
- `workout_exercises(exercise_id)`
- `workout_sets(workout_exercise_id, sort_order)` unique
- `workout_sets(is_completed, completed_at)`

İndeksler gerçek sorgu planları ölçüldükten sonra azaltılabilir veya genişletilebilir.

## 5. Ana veri işlemleri

### Workout başlatma

1. Transaction başlat.
2. Başka active workout olmadığını doğrula.
3. `workouts` kaydını oluştur.
4. Routine seçildiyse sıralı `workout_exercises` snapshot kayıtlarını oluştur.
5. Her exercise için bir boş `workout_sets` satırı oluştur.
6. Transaction'ı tamamla.

### Set tamamlama

1. Weight ve reps değerlerini doğrula.
2. Seti `is_completed = 1` yap.
3. `completed_at` ve `updated_at` yaz.
4. Kalıcı yazma tamamlandıktan sonra UI başarı durumunu göster.

### Workout bitirme

1. Workout'ın active olduğunu doğrula.
2. Tamamlanmış set sayısını kontrol et.
3. Gerekli kullanıcı onayı alınmışsa transaction başlat.
4. `ended_at`, `duration_seconds` ve `status = completed` yaz.
5. Transaction'ı tamamla.

### Egzersiz arşivleme

1. `archived_at` yaz.
2. Mevcut workout snapshot'larına dokunma.
3. Routine referanslarını sessizce silme; routine editörünün kullanıcıyı bilgilendirmesini sağla.

## 6. Progress sorgu tanımı

MVP Exercise Progress yalnız:

- `workouts.status = completed`
- İlgili `exercise_id`
- `workout_sets.is_completed = 1`

olan kayıtları kullanır.

Tarih bazlı bölümde bütün tamamlanmış setler gösterilir. Özet değer, o workout içindeki en yüksek ağırlığa sahip settir; eşit ağırlık varsa tekrar sayısı yüksek olan set tercih edilir. Bu değer PR veya 1RM olarak adlandırılmaz.

## 7. Migration kuralları

- Her şema değişikliği artan sürüm numarasına sahip ayrı migration olmalıdır.
- Migration dosyası uygulandıktan sonra değiştirilmemelidir; düzeltme yeni migration ile yapılır.
- Migration transaction içinde çalıştırılmalıdır.
- Migration öncesi ve sonrası şema sürümü doğrulanmalıdır.
- Seed verisi migration'dan ayrılmalı veya idempotent olmalıdır.
- Üretim verisini silebilecek migration için açık kullanıcı onayı ve veri koruma planı gerekir.
- Şema değişikliği aynı görevde bu belgeye yansıtılmalıdır.

## 8. Açık uygulama ayrıntıları

Aşağıdaki ayrıntılar Phase 1 sırasında kodla birlikte kesinleştirilecek ve karar kaydına geçirilecektir:

- Kimlik üretim yöntemi
- Tüm `sort_order` alanlarının sıfırdan mı birden mi başlayacağı
- Tek active workout için partial unique index desteğinin kesin kullanımı
- Seed egzersiz listesinin kapsamı ve kontrollü kas grubu/category değerleri
