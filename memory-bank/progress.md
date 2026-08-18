# Progress Log

> Son güncelleme: 2026-08-18

Bu dosya tamamlanan çalışmaların tarihsel kaydını tutar. Planlanan iş tamamlanmış gibi yazılmaz. Yeni kayıtlar en üste eklenir.

## 2026-08-18 — Options Modal & Mock Data Cleanup

### Tamamlanan iş

- `src/components/ui/ActionSheetModal.tsx` erişilebilir seçenek modal bileşeni oluşturuldu.
- `ExerciseCard.tsx`, `app/workout/active.tsx`, `app/exercises/[exerciseId]/progress.tsx` ve `app/(tabs)/exercises.tsx` üzerindeki tüm üç nokta (`...`) butonları işlevsel ActionSheetModal'a bağlandı.
- Egzersiz kartlarından egzersiz silme (`removeExercise`), antrenmanı sıfırlama (`clearDraft`), egzersiz arşivleme (`archiveExercise`) ve detay görüntüleme eylemleri aktifleştirildi.
- Egzersizler (seed verisi / veritabanı egzersizleri) dışındaki sahte mock veriler (`referenceWorkout`, `referenceRoutines`, `referenceHistory` ve sahte progress geçmişi) kaldırıldı.
- Verisiz ekran durumları için `EmptyState` bileşenleri bağlandı.

### Doğrulama

- `pnpm typecheck`: Passed (0 errors)
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm test`: Passed (7 suites, 34 tests)
- `npx expo-doctor`: Passed (21/21 checks)
- `npx expo export --platform web`: Passed

## 2026-08-18 — Phase 2 (Exercise System & Persistence)

### Tamamlanan iş

- `src/domain/models/exercise.ts` altında `MuscleGroup`, `ExerciseCategory`, `Exercise`, `CreateExerciseInput`, `UpdateExerciseInput` tipleri ve `MUSCLE_GROUPS`, `EXERCISE_CATEGORIES` sabitleri tanımlandı.
- `src/domain/validation/exerciseValidation.ts` ile egzersiz oluşturma doğrulama kuralları eklendi (boş isim kontrolü, 50 karakter üst sınırı, geçerli kas grubu ve kategori kontrolü).
- `src/database/seed/exercisesSeed.ts` ile 17 varsayılan egzersiz verisi tanımlandı ve `initializeDatabase` migration runner'ına `INSERT OR IGNORE` ile entegre edildi.
- `src/database/repositories/ExerciseRepository.ts` katmanı oluşturuldu (`getAll`, `getById`, `getByName`, `create`, `update`, `archive`, `unarchive`).
- `src/features/exercises/components/CreateExerciseModal.tsx` modal bileşeni yazıldı.
- `src/features/exercises/hooks/useExercises.ts` hook'u SQLite ve in-memory fallback desteğiyle yazıldı.
- `app/exercises/select.tsx` ve `app/(tabs)/exercises.tsx` ekranları `useExercises` ve `CreateExerciseModal` entegrasyonu ile güncellendi.
- Unit ve integration testler eklendi (`exerciseValidation.test.ts`, `ExerciseRepository.test.ts`, `CreateExerciseModal.test.tsx`).

### Doğrulama

- `pnpm typecheck`: Passed (0 errors)
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm test`: Passed (7 suites, 34 tests)
- `npx expo-doctor`: Passed (21/21 checks)
- `npx expo export --platform web`: Passed

## 2026-08-18 — Expo Bundling & Dependency Version Fix

### Tamamlanan iş

- Expo SDK 57 ile uyumsuz olan `react-native` (0.87.0 -> 0.86.2) sürümü uyumlu versiyona çekilerek `ERR_PACKAGE_PATH_NOT_EXPORTED: ./rn-get-polyfills` bundling hatası giderildi.
- Eksik olan `expo-constants` bağımlılığı eklendi.
- `app.json` içindeki geçersiz/eskimiş `newArchEnabled` ve `android.edgeToEdgeEnabled` alanları temizlendi.
- `metro.config.js` dosyası eklenerek `expo-sqlite` WebAssembly (`wasm`) asset çözümlenmesi sağlandı.
- TypeScript 6.0+ uyumluluğu için `tsconfig.json` yapılandırması güncellendi.

### Doğrulama

- `npx expo-doctor`: Passed (21/21 checks)
- `npx expo export --platform web`: Passed (Web bundled successfully)
- `pnpm typecheck`: Passed (0 errors)
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm test`: Passed (4 suites, 21 tests)

## 2026-08-18 — Phase 1A & Phase 1B (Proje Temeli & Tasarım Entegrasyonu)

### Tamamlanan iş

- Proje belgeleri ve Memory Bank `repflow-project-docs/` altından proje köküne taşındı.
- Expo SDK 57, React Native 0.87, TypeScript strict mode, Expo Router v57 ve Expo SQLite altyapısı yapılandırıldı.
- `src/theme` altında colors, typography, spacing, radius, shadows ve motion token'ları kuruldu.
- `referances_design/` salt-okunur referansından 6 mobil ekran (Home, Active Workout, Exercise Selector, Routines, History, Exercise Progress) ve alt tab navigasyonu Expo Router ile bağlandı.
- Active Workout weight/reps düzenleme, set toggle ve set ekleme etkileşimleri `WorkoutDraftProvider` ile aktifleştirildi.
- Exercise Selector arama, kas grubu filtreleme ve egzersiz seçip Active Workout'a aktarma işlevsel kılındı.
- SQLite initialization (`PRAGMA foreign_keys = ON`, `WAL` journal mode) ve `001_initialSchema` migration runner'ı yazıldı.
- Database, component ve provider testleri yazıldı (21 test).

### Doğrulama

- `pnpm typecheck`: Passed (0 errors)
- `pnpm lint`: Passed (0 errors, 0 warnings)
- `pnpm test`: Passed (4 suites, 21 tests)
- Referans klasörü (`referances_design/`) değiştirilmedi.

## 2026-08-18 — Phase 0 dokümantasyon temeli

### Tamamlanan iş

- Gym / Workout Tracking uygulamasının MVP kapsamı netleştirildi.
- MVP dışında tutulacak özellikler ayrıldı.
- React Native + Expo + TypeScript + Expo SQLite mimarisi kabul edildi.
- Ürün gereksinimleri `prd.md` içine yazıldı.
- AI guidelines ve Memory Bank oluşturuldu.
