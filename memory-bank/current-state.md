# Current State

> Son güncelleme: 2026-08-18  
> Aktif faz: Phase 2 (Exercise System & Persistence) Completed  
> Genel durum: Exercise domain models, repository, database seed, custom exercise creation modal, hooks, UI integration and all unit/integration tests passed.

## 1. Tamamlananlar

- **Phase 1 Foundation & Fixes:**
  - Proje belgeleri köke taşındı ve bağlayıcı kurallar doğrulandı.
  - React Native 0.86.2 + Expo SDK 57 + Expo Router v57 + TypeScript strict mode projesi uyumlu sürümlerle yapılandırıldı.
  - Metro web bundler `./rn-get-polyfills` ve `.wasm` asset sorunları çözüldü.
- **Phase 2 Exercise System & Persistence:**
  - Kas grubu (`MuscleGroup`) ve Kategori (`ExerciseCategory`) domain tipleri ile doğrulama kuralları (`exerciseValidation.ts`) yazıldı.
  - Seed egzersiz altyapısı (`exercisesSeed.ts`) oluşturuldu ve `initializeDatabase` migration runner'ına entegre edildi (17 varsayılan egzersiz).
  - SQLite tabanlı `ExerciseRepository` katmanı yazıldı (`getAll`, `getById`, `getByName`, `create`, `update`, `archive`, `unarchive`).
  - Özel egzersiz ekleme modal'ı (`CreateExerciseModal.tsx`) oluşturuldu.
  - `useExercises` hook'u SQLite ve fallback modları destekleyecek şekilde yazıldı.
  - `app/exercises/select.tsx` ve `app/(tabs)/exercises.tsx` ekranları `useExercises` hook'u ve `CreateExerciseModal` ile bağlandı.
  - `exerciseValidation`, `ExerciseRepository`, `initializeDatabase` ve `CreateExerciseModal` testleri eklendi (7 test suite, 34 test %100 PASSED).
- **Doğrulamalar:**
  - `pnpm typecheck`: PASSED (0 hata)
  - `pnpm lint`: PASSED (0 hata, 0 uyarı)
  - `pnpm test`: PASSED (7 test suite, 34 test)
  - `npx expo-doctor`: PASSED (21/21)
  - `npx expo export --platform web`: PASSED

## 2. Henüz yapılmayanlar / Sıradaki Fazlar

- Active workout SQLite persistence & single active workout enforcement (Phase 3).
- Workout duration calculation & active workout recovery (Phase 3).
- Routine persistence & CRUD (Phase 4).
- History ve Progress ekranlarının SQLite sorgularına bağlanması (Phase 5).

## 3. Aktif kararlar

- React Native + Expo + TypeScript
- Expo Router
- Expo SQLite (`SQLiteProvider` + `initializeDatabase` + `ExerciseRepository`)
- Custom exercise validation limit: 50 karakter isim sınırı, case-insensitive benzersizlik ve domain enum kontrolleri.
- Soft delete: Kullanılmış/arşivlenmiş egzersizler hard delete yapılmaz (`archived_at`).

## 4. Bilinen riskler ve kısıtlar

| Risk | Mevcut yaklaşım |
| --- | --- |
| Altı referans ekranında workout persistence olmaması | Phase 3'te Active Workout SQLite repository entegrasyonu ile sağlanacak. |

## 5. Sıradaki mantıklı adım

Kullanıcı onayı ile Phase 3 (Active Workout Core & Persistence) geliştirmesine geçmek.
