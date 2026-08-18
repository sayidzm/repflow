# Testing Strategy

> Durum: Planlandı, test altyapısı henüz kurulmadı  
> Son güncelleme: 2026-08-18

## 1. Test hedefi

En yüksek öncelik, kullanıcının workout verisini kaybetmesini veya yanlış geçmiş görmesini önlemektir. Test kapsamı dosya sayısına göre değil, ürün riskine göre belirlenir.

## 2. Test katmanları

### 2.1 Unit tests

Test edilecek örnek domain davranışları:

- Ağırlık doğrulama
- Tekrar doğrulama
- Workout süre hesaplama
- Set tamamlanma kuralları
- En ağır set seçimi
- Routine'den workout modeline dönüşüm
- Sıralama yardımcıları

### 2.2 Repository ve database integration tests

- Migration'ların boş veritabanına uygulanması
- Migration'ın tekrar çalıştırıldığında güvenli davranması
- Foreign key davranışı
- Transaction rollback
- Tek active workout kuralı
- Workout + exercise + set kaydının birlikte korunması
- Egzersiz arşivlemenin geçmişi bozmaması
- Routine silmenin tamamlanan workout'ı silmemesi
- Progress sorgusunun yalnız completed veri kullanması

### 2.3 Component tests

Jest, `jest-expo` ve React Native Testing Library ile:

- Set satırına ağırlık ve tekrar girişi
- Tamamla kontrolü
- Geçersiz veri mesajları
- Empty state'ler
- Confirm dialog davranışları
- Aktif workout'a devam çağrısı
- Egzersiz arama ve filtreleme

### 2.4 Navigation tests

- Ana navigasyon route'ları
- Routine'den Active Workout'a geçiş
- Workout tamamlandıktan sonra detail ekranına geçiş
- Uygulama açılışında active workout recovery yönlendirmesi

### 2.5 Manuel cihaz testleri

Native SQLite ve mobil klavye davranışı nedeniyle gerçek cihaz veya development build üzerinde kontrol gerekir.

Öncelikli ekran genişlikleri:

- 360 px Android
- 390–412 px Android/iOS
- Küçük ekran yüksekliği ve açık sayısal klavye

## 3. Kritik senaryolar

| Kimlik | Senaryo | Beklenen sonuç |
| --- | --- | --- |
| CT-001 | Boş workout başlat | Tek active workout oluşur ve süre başlar. |
| CT-002 | Routine'den workout başlat | Egzersizler doğru sırada ve snapshot ile oluşur. |
| CT-003 | Geçerli set tamamla | Weight, reps, completed ve completedAt kalıcı kaydedilir. |
| CT-004 | Geçersiz set tamamla | İşlem engellenir ve alan düzeyinde hata görünür. |
| CT-005 | Uygulamayı active workout sırasında kapat/aç | Workout ve son kaydedilmiş setler geri gelir. |
| CT-006 | Workout bitir | Status, endedAt ve duration doğru kaydedilir. |
| CT-007 | Tamamlanan workout'ı geçmişte aç | Egzersiz ve setler eksiksiz görünür. |
| CT-008 | Kullanılmış egzersizi yeniden adlandır | Eski workout snapshot adı değişmez. |
| CT-009 | Kullanılmış egzersizi arşivle | Geçmiş korunur; egzersiz yeni seçimde gizlenir. |
| CT-010 | Aynı anda ikinci workout başlat | İkinci active kayıt oluşmaz. |
| CT-011 | İnternet kapalıyken tam akış | Temel döngü eksiksiz çalışır. |
| CT-012 | Progress ekranını aç | Yalnız completed workout ve setler listelenir. |
| CT-013 | Veri yazma hatası simüle et | UI sahte başarı göstermez; güvenli hata sunar. |
| CT-014 | Tamamlanmamış setlerle workout bitir | Kullanıcı bilgilendirilir; onay sonrası veri korunur. |

## 4. Regresyon paketi

Her anlamlı feature değişikliğinde en az:

1. Workout başlatma
2. Set ekleme ve tamamlama
3. Uygulama yeniden açılışında recovery
4. Workout bitirme
5. Geçmiş detayını okuma
6. Progress sorgusu

kontrol edilmelidir.

## 5. Kod kalitesi kontrolleri

Phase 1 sırasında standart komutlar tanımlanacaktır:

- Type-check
- Lint
- Unit/component tests
- Gerekirse test coverage raporu

Coverage yüzdesi tek başına kalite hedefi değildir. Kritik domain ve repository davranışlarının kapsanması önceliklidir.

## 6. MVP kabul testi

MVP release candidate için:

- [ ] Bütün kritik senaryolar geçiyor.
- [ ] Type-check hatası yok.
- [ ] Lint hatası yok.
- [ ] Otomatik testler geçiyor.
- [ ] İnternet kapalı manuel test tamamlandı.
- [ ] En az bir gerçek Android cihazda Active Workout akışı tamamlandı.
- [ ] Destekleniyorsa bir iOS cihaz/simulator akışı kontrol edildi.
- [ ] Uygulama kapatma/açma recovery testi geçti.
- [ ] Bilinen veri kaybı hatası yok.
- [ ] Kritik veya high severity açık hata yok.
- [ ] PRD, current state ve gerçek uygulama davranışı tutarlı.

## 7. Hata önem seviyeleri

- Critical: Veri kaybı, workout açılamaması veya uygulamanın temel döngüde çökmesi
- High: Ana özelliğin yanlış sonuç üretmesi veya önemli akışın tamamlanamaması
- Medium: Workaround bulunan işlevsel veya önemli UX sorunu
- Low: Kozmetik, metinsel veya temel kullanımı engellemeyen küçük sorun

MVP, bilinen Critical veya High hata ile tamamlanmış sayılmaz.
