# Current State

> Son güncelleme: 2026-08-18  
> Aktif faz: Phase 2 (Exercise System & Persistence) Completed + Options Modal & Mock Data Cleanup  
> Genel durum: Exercise domain models, repository, database seed, custom exercise creation modal, options action sheet for ellipsis buttons, mock workout/routine/history data cleanup and all unit/integration tests passed.

## 1. Tamamlananlar

- **Options (Üç Nokta) Butonları Entegrasyonu:**
  - `src/components/ui/ActionSheetModal.tsx` erişilebilir ve şık seçenek modal'ı oluşturuldu.
  - `ExerciseCard.tsx` içindeki üç nokta butonuna basıldığında "View Progress" ve "Remove Exercise" seçenekleri eklendi.
  - `app/workout/active.tsx` üst barındaki üç nokta butonuna "Add Exercise" ve "Discard Workout" seçenekleri eklendi.
  - `app/exercises/[exerciseId]/progress.tsx` üst barındaki üç nokta butonuna "Archive Exercise" seçeneği eklendi.
  - `app/(tabs)/exercises.tsx` kütüphane listesindeki her egzersiz satırına seçenek (üç nokta) butonu eklendi ("View Progress", "Archive Exercise").
- **Mock Veri Temizliği (Egzersizler Hariç):**
  - Hazır egzersiz seed verileri ve kütüphane egzersizleri KORUNDU.
  - `referenceWorkout`, `referenceRoutines` ve `referenceHistory` mock dizileri boşaltıldı (`[]`).
  - `ExerciseProgressScreen` içindeki sahte set geçmişi temizlendi; verisiz durumlarda `EmptyState` bileşenleri bağlandı.
- **Doğrulamalar:**
  - `pnpm typecheck`: PASSED (0 hata)
  - `pnpm lint`: PASSED (0 hata, 0 uyarı)
  - `pnpm test`: PASSED (7 test suite, 34 test %100 PASSED)
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
