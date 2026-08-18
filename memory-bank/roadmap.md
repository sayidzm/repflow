# Roadmap

> Son güncelleme: 2026-08-18
> Kural: MVP sonrası maddeler kullanıcı onayı olmadan uygulanmaz.

## Phase 0 — Documentation and Scope Lock

Durum: Completed

- [X] Ürün gereksinimlerini belirle
- [X] MVP kapsamını kesinleştir
- [X] MVP dışı özellikleri listele
- [X] Ekranları ve kullanıcı akışlarını belirle
- [X] Veri modelini planla
- [X] Teknik mimariyi belirle
- [X] AI çalışma kurallarını yaz
- [X] Memory Bank'i oluştur

## Phase 1 — Project Foundation

Durum: Completed

- [x] Uygulama adı ve identifier kararını kesinleştir
- [x] Expo + TypeScript projesini oluştur
- [x] Expo Router iskeletini kur
- [x] Type-check, lint ve test komutlarını kur
- [x] Design token temelini oluştur
- [x] Minimum shared UI bileşenlerini oluştur
- [x] SQLite bootstrap ekle
- [x] Migration runner oluştur
- [x] İlk şema migration'ını oluştur
- [x] Feature-based klasör yapısını kur

Çıkış kriteri: Uygulama açılır, route iskeleti çalışır, boş veritabanı migration'ları uygulanır ve temel kalite komutları geçer.

## Phase 2 — Exercise System

Durum: Completed

- [x] Kas grubu ve kategori domain değerlerini tanımla
- [x] Hazır egzersiz seed verisini ekle
- [x] Egzersiz repository'sini uygula
- [x] Egzersiz listesi
- [x] Arama ve filtreleme
- [x] Özel egzersiz oluşturma/düzenleme
- [x] Arşivleme
- [x] Unit, repository ve component testleri

Çıkış kriteri: Kullanıcı offline biçimde egzersiz arayabilir ve özel egzersiz yönetebilir; geçmiş bütünlüğü kuralları test edilir.

## Phase 3 — Active Workout Core

Durum: Completed

- [x] Tek active workout kuralı
- [x] Boş workout başlatma
- [x] Süre gösterimi
- [x] Workout'a egzersiz ekleme/çıkarma
- [x] Set ekleme/silme
- [x] Weight ve reps girişi
- [x] Set tamamlama
- [x] Her anlamlı değişikliği kalıcılaştırma
- [x] Uygulama açılışında recovery
- [x] Workout bitirme ve iptal
- [x] Kritik test paketi

Çıkış kriteri: Boş workout akışı gerçek cihazda offline tamamlanabilir ve uygulama yeniden açıldığında veri kaybolmaz.

## Phase 4 — Routines

Durum: Completed

- [x] Routine listesi
- [x] Routine oluşturma/düzenleme/silme
- [x] Egzersiz ekleme/çıkarma/sıralama
- [x] Routine'den workout üretme
- [x] Arşivli egzersiz durumu
- [x] Testler

Çıkış kriteri: Routine, doğru egzersiz sırası ve snapshot'larla yeni workout oluşturur.

## Phase 5 — History and Progress

Durum: Completed

- [x] Geçmiş listesi
- [x] Workout detail
- [x] Egzersiz progress listesi
- [x] Workout başına en ağır set özeti
- [x] Uzun liste performansı
- [x] Query ve UI testleri

Çıkış kriteri: Tamamlanan workout'lar doğru görünür ve exercise progress yalnız geçerli completed veriden üretilir.

## Phase 6 — Stabilization

Durum: Completed

- [x] Error ve empty state'leri tamamla
- [x] Accessibility kontrolü
- [x] 360–412 px responsive kontrolü
- [x] Klavye ve tek elle kullanım testi
- [x] Database hata ve rollback testleri
- [x] Recovery ve regresyon paketi
- [x] Performans ölçümleri
- [x] Dokümantasyon senkronizasyonu

Çıkış kriteri: Bilinen Critical/High hata yoktur ve kritik test senaryoları geçer.

## Phase 7 — MVP Release Candidate

Durum: In Progress

- [x] MVP kabul kontrol listesini tamamla (kod tarafı: typecheck, lint, test, expo-doctor, export, prebuild, FR-001…FR-016 eşlemesi)
- [ ] Gerçek cihaz testini tamamla (kullanıcı bağımlı)
- [ ] Release build doğrulaması (kullanıcı bağımlı; prebuild üretimi doğrulandı)
- [ ] Bilinen sınırlamaları belgele
- [ ] MVP kullanım geri bildirimi topla (kullanıcı bağımlı)

Çıkış kriteri: `prd.md` başarı kriterlerinin tamamı karşılanır.

## MVP sonrası aday sırası

Bu liste onaylı geliştirme emri değildir. MVP geri bildirimine göre yeniden sıralanır.

### Grup A — Kullanım hızını artıranlar

- Rest timer
- Önceki workout setlerini gösterme
- Önceki seti hızlı kopyalama
- Workout notları

### Grup B — Progress ve analytics

- Personal Records
- 1RM hesaplama
- Volume tracking
- Grafikler
- Workout streak ve takvim

### Grup C — Gelişmiş antrenman yapıları

- Superset
- Drop set
- Warm-up ve çalışma seti türleri
- RPE / RIR

### Grup D — Kişisel takip

- Vücut ağırlığı
- Ölçüler
- Fotoğraf progress

### Grup E — Veri taşınabilirliği

- Export/import
- Backup/restore

### Grup F — Hesap ve senkronizasyon

- Kullanıcı hesabı
- Cloud sync
- Çoklu cihaz
- Senkronizasyon conflict çözümü

### Grup G — Entegrasyonlar

- Apple Health
- Health Connect
- Wearable cihazlar

### Grup H — AI

- AI workout assistant
- Geçmiş veriye dayalı öneriler
- Açıklanabilir ve kullanıcı onaylı program değişiklikleri

## Roadmap kapsam kapısı

Bir MVP sonrası özellik geliştirilmeden önce:

1. Çözdüğü kullanıcı problemi tanımlanır.
2. MVP kullanım verisi veya geri bildirimiyle önceliği doğrulanır.
3. Veri modeli ve mimari etkisi değerlendirilir.
4. Yeni kabul kriterleri yazılır.
5. Kullanıcı onayı alınır.
6. `prd.md`, `decisions.md` ve bu roadmap güncellenir.
