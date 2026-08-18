# Current State

> Son güncelleme: 2026-08-18  
> Aktif faz: Phase 7 (MVP Release Candidate) — kod tarafı doğrulama tamamlandı, gerçek cihaz testi bekliyor.  
> Genel durum: COD tarafı kabul kontrol listesi geçti (typecheck/lint/test/expo-doctor/export/prebuild). Gerçek cihaz ve kullanım geri bildirimi adımları kullanıcı bağımlıdır. Web platformunda kalıcılık yoktur (SQLite native-only); veri kalıcılığı Android/iOS'ta sağlanır.

## 1. Tamamlananlar

- **Phase 7 kod tarafı doğrulama:**
  - `pnpm typecheck`: PASSED
  - `pnpm lint`: PASSED
  - `pnpm test`: PASSED (14 suite, 61 test)
  - `npx expo-doctor`: PASSED (21/21)
  - `npx expo export --platform web`: PASSED
  - `npx expo prebuild --platform android`: PASSED (native dizin üretimi doğrulandı; üretilen `android/` folder'ı ve script değişikliği geri alındı)
  - `prd.md` FR-001…FR-016 eşlemesi tamamlandı.
- **Phase 6 — Stabilization & Polish:** (önceki durum korunuyor)
  - `WorkoutSetRow` bileşeni 360–412 px aralığında dar ekran taşmasına karşı esnek hale getirildi (minWidth + flex tabanlı sütunlar).
  - `src/components/ui/ErrorState.tsx` bileşeni eklendi (hata mesajı + "Tekrar Dene" aksiyonu).
  - `useReducedMotion` hook'u için unit test eklendi.
  - `expo export --platform web` başarıyla tamamlandı (2711 modül web bundle).
- **Türkçe Uygulama Arayüzü (Localization):**
  - Egzersiz/hareket isimleri ve kas grubu değerleri hariç tüm navigasyon, buton, başlık, etiket, tarih/süre ve modal metinleri Türkçe diline çevrildi.
- **History and Progress System (Phase 5):**
  - `HistoryRepository` katmanı ile tamamlanmış antrenmanların (`status = completed`) tarih bazında gruplanarak listelenmesi ve antrenman detaylarının SQLite'tan çekilmesi sağlandı.
  - `ProgressRepository` katmanı ile egzersiz bazlı geçmiş setlerin, son tamamlanan setin ve antrenman başına en ağır setin hesabı bağlandı.
- **Routines System & Persistence (Phase 4):**
  - RoutineRepository, CreateRoutineModal ve rutinden antrenman başlatma hazır.
- **Active Workout Persistence (Phase 3):**
  - Active Workout SQLite persistence, single active workout rule ve recovery sistemi hazır.
- **Egzersiz Katmanı & Seed (Phase 2):**
  - 229 vücut geliştirme egzersizi (`exercisesSeed.ts`), custom exercise modal'ı ve `ExerciseRepository` hazır.
- **Doğrulamalar:**
  - `pnpm typecheck`: PASSED (0 hata)
  - `pnpm lint`: PASSED (0 hata, 0 uyarı)
  - `pnpm test`: PASSED (14 test suite, 61 test %100 PASSED)
  - `npx expo export --platform web`: PASSED

## 2. Henüz yapılmayanlar / Sıradaki Fazlar

- Phase 7 kalan adımlar (kullanıcı bağımlı):
  - Gerçek cihaz / emülatör manuel testi (offline workout döngüsü, recovery, geçmiş/progress).
  - MVP kullanım geri bildirimi toplanması ve roadmap kapsam kapısı değerlendirmesi.

## 2.1 Web platform davranışı

- Expo SQLite native platformlarda (iOS/Android) çalışır; web tarayıcısında desteklenmez.
- Web'de `useRoutines` ve `WorkoutDraftProvider` in-memory fallback ile çalışır; hata fırlatmaz ancak veri kalıcı değildir.
- Web, geliştirme/UI doğrulaması için kullanılabilir; veri kalıcılığı testleri Android/iOS'ta yapılmalıdır.

## 3. Aktif kararlar

- React Native + Expo + TypeScript
- Expo Router
- Expo SQLite (`SQLiteProvider` + `initializeDatabase` + `ExerciseRepository` + `WorkoutRepository` + `RoutineRepository` + `HistoryRepository` + `ProgressRepository`)
- Single active workout constraint (`workouts_single_active_idx`).
- Dynamic Exercise Progress calculation: PR/1RM adlandırması olmadan sade en ağır set özeti.
- UI Dili: Türkçe (Egzersiz/hareket adları hariç).

## 4. Bilinen riskler ve kısıtlar

| Risk | Mevcut yaklaşım |
| --- | --- |
| Expo SDK sürümü gerçek cihaz release build'inde teyit edilmelidir | Phase 7'de gerçek cihaz ve release build doğrulaması yapılacak. |
| Web'de SQLite çalışmaz; veriler session ile sınırlıdır | Web geliştirme/UI doğrulaması içindir; kalıcı veri Android/iOS. IndexedDB gibi web kalıcılığı MVP dışı karardır. |

## 5. Sıradaki mantıklı adım

Kullanıcı onayı ile gerçek cihaz (veya emülatör) üzerinde Phase 7 manuel test akışlarını tamamlamak; ardından MVP kullanım geri bildirimini toplayıp roadmap kapsam kapısına göre değerlendirmek.
