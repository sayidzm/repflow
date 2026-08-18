# Project Context

> Son güncelleme: 2026-08-18  
> Aktif ürün aşaması: MVP hazırlığı

## 1. Ürün özeti

Proje, spor salonunda antrenman sırasında ağırlık ve tekrarları hızlı biçimde kaydetmek için geliştirilen offline-first bir mobil Gym / Workout Tracking uygulamasıdır.

Ürün, özellik sayısından önce şu üç sonuca odaklanır:

1. Set kaydetme hızının yüksek olması
2. Aktif workout verisinin güvenilir biçimde korunması
3. Geçmiş performansın sade ve anlaşılır görüntülenmesi

## 2. Ana kullanıcı problemi

Kullanıcı setler arasında kısa sürede:

- Doğru egzersizi bulmak
- Ağırlık ve tekrar girmek
- Seti tamamlandı olarak işaretlemek
- Sonraki sete geçmek

ister. Uzun formlar, gereksiz ekran geçişleri ve internet zorunluluğu bu akışı bozar.

## 3. Ana ürün ilkesi

> Kullanıcı antrenman yaparken uygulamayla uğraşmamalı; uygulama antrenmanı kaydetmeyi kolaylaştırmalıdır.

## 4. MVP çekirdeği

- Hazır ve özel egzersizler
- Routine oluşturma ve routine'den workout başlatma
- Active Workout
- Weight, Reps ve Completed set verisi
- Workout süresi
- Workout geçmişi
- Egzersiz bazlı sade performans geçmişi
- Tam offline çalışma

## 5. Temel kullanıcı döngüsü

```text
Workout başlat
→ Egzersiz ekle
→ Setleri kaydet
→ Workout'ı bitir
→ Geçmişi kontrol et
→ Sonraki workout'ta devam et
```

## 6. Ürün sınırları

MVP şu anda:

- Tek kullanıcıya yöneliktir.
- Tek cihazdaki yerel veriyi esas alır.
- Varsayılan olarak kilogram kullanır.
- Hesap veya cloud sync içermez.
- Backend gerektirmez.
- Sosyal, beslenme veya AI özellikleri içermez.
- Gelişmiş analytics veya workout teknikleri içermez.

## 7. UX öncelikleri

- Active Workout tam ekran ve dikkat dağıtmayan bir yapı kullanır.
- Set satırında ağırlık, tekrar ve tamamla kontrolleri birlikte bulunur.
- Ana eylemler ekranın kolay erişilen alanlarında yer alır.
- Dokunma alanları küçük ikonlarla sınırlanmaz.
- Kritik silme, iptal ve bitirme işlemleri doğrulama ister.
- Kullanıcı aktif workout'ın kaydedilip kaydedilmediği konusunda belirsizlik yaşamaz.

## 8. Teknik bağlam

Onaylanan başlangıç yaklaşımı:

- React Native + Expo
- TypeScript strict mode
- Expo Router
- Expo SQLite
- Feature-based modüler yapı
- Repository tabanlı veri erişimi
- React hooks ve sınırlı Context/useReducer kullanımı
- Jest ve React Native Testing Library

## 9. Başarı tanımı

MVP, internet bağlantısı olmadan bütün temel workout döngüsü tamamlanabildiğinde; aktif workout yeniden başlatma sonrası kurtarıldığında; geçmiş ve progress doğru üretildiğinde; kritik veri kaybı hatası kalmadığında başarılıdır.

## 10. Mevcut durum özeti

- Ürün planı onaylandı.
- Proje dokümantasyonu ve Memory Bank oluşturuldu.
- Uygulama kaynak kodu henüz oluşturulmadı.
- Sıradaki teknik adım, kullanıcı talebiyle Phase 1 proje temelinin kurulmasıdır.
