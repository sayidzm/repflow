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

Durum: Planned

- [ ] Tek active workout kuralı
- [ ] Boş workout başlatma
- [ ] Süre gösterimi
- [ ] Workout'a egzersiz ekleme/çıkarma
- [ ] Set ekleme/silme
- [ ] Weight ve reps girişi
- [ ] Set tamamlama
- [ ] Her anlamlı değişikliği kalıcılaştırma
- [ ] Uygulama açılışında recovery
- [ ] Workout bitirme ve iptal
- [ ] Kritik test paketi

Çıkış kriteri: Boş workout akışı gerçek cihazda offline tamamlanabilir ve uygulama yeniden açıldığında veri kaybolmaz.

## Phase 4 — Routines

Durum: Planned

- [ ] Routine listesi
- [ ] Routine oluşturma/düzenleme/silme
- [ ] Egzersiz ekleme/çıkarma/sıralama
- [ ] Routine'den workout üretme
- [ ] Arşivli egzersiz durumu
- [ ] Testler

Çıkış kriteri: Routine, doğru egzersiz sırası ve snapshot'larla yeni workout oluşturur.

## Phase 5 — History and Progress

Durum: Planned

- [ ] Geçmiş listesi
- [ ] Workout detail
- [ ] Egzersiz progress listesi
- [ ] Workout başına en ağır set özeti
- [ ] Uzun liste performansı
- [ ] Query ve UI testleri

Çıkış kriteri: Tamamlanan workout'lar doğru görünür ve exercise progress yalnız geçerli completed veriden üretilir.

## Phase 6 — Stabilization

Durum: Planned

- [ ] Error ve empty state'leri tamamla
- [ ] Accessibility kontrolü
- [ ] 360–412 px responsive kontrolü
- [ ] Klavye ve tek elle kullanım testi
- [ ] Database hata ve rollback testleri
- [ ] Recovery ve regresyon paketi
- [ ] Performans ölçümleri
- [ ] Dokümantasyon senkronizasyonu

Çıkış kriteri: Bilinen Critical/High hata yoktur ve kritik test senaryoları geçer.

## Phase 7 — MVP Release Candidate

Durum: Planned

- [ ] MVP kabul kontrol listesini tamamla
- [ ] Gerçek cihaz testini tamamla
- [ ] Release build doğrulaması
- [ ] Bilinen sınırlamaları belgele
- [ ] MVP kullanım geri bildirimi topla

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
