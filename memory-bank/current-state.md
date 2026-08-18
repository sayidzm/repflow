# Current State

> Son güncelleme: 2026-08-18  
> Aktif faz: Phase 3 (Active Workout Core & Persistence) Completed  
> Genel durum: Active Workout SQLite persistence, single active workout enforcement, timer calculation, automatic recovery on app launch, finish/discard workout persistence and 49 unit/repository/component tests passed (%100).

## 1. Tamamlananlar

- **Active Workout Persistence (Phase 3):**
  - `WorkoutRepository` katmanı ile SQLite üzerinde `workouts`, `workout_exercises` (snapshots) ve `workout_sets` tablolarına tam CRUD yazma desteği sağlandı.
  - `workouts_single_active_idx` partial index ile veritabanında aynı anda en fazla bir aktif antrenman olması kuralı garanti altına alındı.
  - `started_at` timestamp'leri ile dynamic timer süresi hesabı ve antrenman bitirme (`status = completed`, `duration_seconds`) / iptal (`status = cancelled`) durumları bağlandı.
  - Uygulama yeniden başlatıldığında (veya sayfa yenilendiğinde) aktif antrenman SQLite repository üzerinden otomatik recovery edilmektedir.
  - `WorkoutDraftProvider` ile context ve SQLite senkronize edildi.
- **Egzersiz Katmanı & Seed (Phase 2):**
  - 229 vücut geliştirme egzersizi (`exercisesSeed.ts`), custom exercise modal'ı ve `ExerciseRepository` hazır.
- **Doğrulamalar:**
  - `pnpm typecheck`: PASSED (0 hata)
  - `pnpm lint`: PASSED (0 hata, 0 uyarı)
  - `pnpm test`: PASSED (9 test suite, 49 test %100 PASSED)
  - `npx expo-doctor`: PASSED (21/21 checks)

## 2. Henüz yapılmayanlar / Sıradaki Fazlar

- Routine persistence & CRUD (Phase 4).
- Routine'den workout başlatma (Phase 4).
- History ve Progress ekranlarının SQLite sorgularına bağlanması (Phase 5).

## 3. Aktif kararlar

- React Native + Expo + TypeScript
- Expo Router
- Expo SQLite (`SQLiteProvider` + `initializeDatabase` + `ExerciseRepository` + `WorkoutRepository`)
- Single active workout constraint (`workouts_single_active_idx`).
- Custom exercise validation limit: 50 karakter isim sınırı, case-insensitive benzersizlik ve domain enum kontrolleri.
- Soft delete: Kullanılmış/arşivlenmiş egzersizler hard delete yapılmaz (`archived_at`).

## 4. Bilinen riskler ve kısıtlar

| Risk | Mevcut yaklaşım |
| --- | --- |
| Routine CRUD olmaması | Phase 4'te Routine SQLite repository entegrasyonu ile sağlanacak. |

## 5. Sıradaki mantıklı adım

Kullanıcı onayı ile Phase 4 (Routines Core & Persistence) geliştirmesine geçmek.
