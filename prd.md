# Gym / Workout Tracking App — Product Requirements Document

> Status: MVP kapsamı onaylandı, uygulandı (Phase 1–6 tamamlandı), MVP Release Candidate aşamasında (Phase 7)  
> Belge sürümü: 1.0  
> Son güncelleme: 2026-08-18

## 1. Ürün vizyonu

Spor salonunda antrenman yapan kişinin egzersizlerini ve setlerini mümkün olan en az işlemle kaydetmesini, geçmiş performansını güvenilir biçimde görmesini ve uygulamayı internet bağlantısı olmadan kullanmasını sağlayan hızlı bir mobil antrenman takip uygulaması oluşturmak.

Ana ürün ilkesi:

> Kullanıcı antrenman yaparken uygulamayla uğraşmamalı; uygulama antrenmanı kaydetmeyi kolaylaştırmalıdır.

## 2. Çözülen problem

Mevcut takip yöntemleri genellikle şu sorunlardan birini taşır:

- Kâğıt veya not uygulamaları geçmiş veriyi düzenli karşılaştırmayı zorlaştırır.
- Kapsamlı fitness uygulamaları set aralarında kullanılmak için fazla karmaşık olabilir.
- İnternet veya hesap zorunluluğu spor salonunda güvenilirliği azaltabilir.
- Aktif antrenman sırasında çok fazla ekran ve dokunma, kullanıcının odağını böler.

Bu ürün, hızlı kayıt, yerel veri güvenilirliği ve sade performans geçmişi üzerine odaklanır.

## 3. Hedef kullanıcı

Birincil kullanıcı:

- Spor salonunda düzenli ağırlık antrenmanı yapan kişi
- Ağırlık ve tekrarlarını telefonundan hızlıca kaydetmek isteyen kişi
- Sık kullandığı programları routine olarak saklamak isteyen kişi
- İnternet bağlantısı olmadan çalışabilen kişisel bir takip aracı isteyen kişi

MVP varsayımları:

- Uygulama tek kullanıcı tarafından, öncelikle tek cihazda kullanılır.
- Android ve iOS hedeflenir.
- Varsayılan ağırlık birimi kilogramdır.
- Hesap, abonelik, backend ve cloud sync bulunmaz.

## 4. Temel kullanım senaryoları

1. Kullanıcı boş bir antrenman başlatır, egzersiz ekler ve setlerini kaydeder.
2. Kullanıcı kayıtlı bir routine seçer; egzersizler aktif antrenmana otomatik eklenir.
3. Kullanıcı her set için ağırlık ve tekrar girerek seti tamamlandı olarak işaretler.
4. Kullanıcı antrenmanı bitirir ve kaydı geçmişte görüntüler.
5. Kullanıcı belirli bir egzersizin önceki antrenmanlardaki performansını inceler.
6. Kullanıcı listede olmayan özel bir egzersiz oluşturur.
7. Uygulama beklenmedik şekilde kapanır; kullanıcı açtığında aktif antrenmanına devam eder.

## 5. MVP kapsamı

### 5.1 Egzersiz yönetimi

- Hazır temel egzersiz listesi
- Egzersiz arama
- Kas grubuna ve kategoriye göre filtreleme
- Özel egzersiz oluşturma
- Özel egzersizi düzenleme
- Kullanılmış egzersizi geçmiş kayıtları bozmadan arşivleme

Her egzersiz en az şu bilgileri taşır:

- Ad
- Kas grubu
- Kategori/tür
- Hazır veya kullanıcı tarafından oluşturulmuş olma durumu

### 5.2 Routine yönetimi

- Routine oluşturma
- Routine adını düzenleme
- Routine'e egzersiz ekleme
- Routine'den egzersiz çıkarma
- Routine içindeki egzersiz sırasını belirleme
- Routine silme
- Routine üzerinden yeni antrenman başlatma

MVP routine'i yalnızca adı ve sıralı egzersiz listesini tutar. Routine başlatıldığında her egzersiz için bir boş başlangıç seti oluşturulur; kullanıcı gerekli setleri aktif antrenmanda ekler.

### 5.3 Aktif antrenman

- Boş antrenman başlatma
- Routine üzerinden antrenman başlatma
- Aynı anda yalnızca bir aktif antrenman
- Başlangıç zamanını ve geçen süreyi gösterme
- Egzersiz ekleme ve kaldırma
- Set ekleme ve silme
- Set için ağırlık ve tekrar girişi
- Seti tamamlandı/tamamlanmadı olarak işaretleme
- Antrenmanı bitirme
- Antrenmanı iptal etme
- Uygulama kapatıldıktan sonra aktif antrenmanı geri yükleme

### 5.4 Geçmiş

- Tamamlanan antrenmanları ters kronolojik sırada listeleme
- Tarih, başlangıç zamanı ve süreyi gösterme
- Antrenman detayında egzersizleri ve setleri gösterme
- Her sette ağırlık, tekrar ve tamamlanma durumunu gösterme

### 5.5 Basit progress

- Kullanıcının bir egzersiz seçebilmesi
- Seçilen egzersizin tamamlanmış antrenmanlardaki setlerini tarihe göre göstermesi
- Her antrenmanın en ağır tamamlanmış setini sade özet olarak göstermesi
- Aynı kayıtta tüm tamamlanmış setlere erişim sağlaması

Progress ekranında grafik, tahmin veya karmaşık istatistik bulunmaz.

## 6. MVP dışında kalan özellikler

Aşağıdakiler MVP tamamlanmadan otomatik olarak geliştirilmeyecektir:

- Personal Record sistemi
- 1RM hesaplama
- Grafikler ve detaylı analytics
- Volume tracking
- Rest timer
- Superset ve drop set
- RPE ve RIR
- Vücut ağırlığı ve ölçü takibi
- Fotoğraf ile progress
- Workout streak
- Takvim
- Cloud sync
- Kullanıcı hesabı
- Backup, restore, export ve import
- Apple Health ve Health Connect
- Wearable entegrasyonu
- AI workout assistant
- Sosyal özellikler
- Beslenme veya kalori takibi
- Abonelik ve ödeme sistemi
- Web yönetim paneli

## 7. Ana ekranlar

| Ekran | Temel görev |
| --- | --- |
| Ana Sayfa | Yeni workout başlatmak veya aktif workout'a devam etmek |
| Workout Başlat | Boş workout ya da routine seçmek |
| Active Workout | Egzersiz ve setleri hızlı biçimde kaydetmek |
| Egzersiz Seçici | Arama ve filtre ile egzersiz eklemek |
| Egzersizler | Hazır ve özel egzersizleri görüntülemek |
| Egzersiz Oluştur/Düzenle | Egzersiz bilgilerini yönetmek |
| Routines | Kayıtlı programları listelemek |
| Routine Editor | Routine adını ve egzersiz sırasını düzenlemek |
| Geçmiş | Tamamlanan workout'ları listelemek |
| Workout Detail | Tek bir workout'ın tüm verisini göstermek |
| Exercise Progress | Seçilen egzersizin geçmiş performansını göstermek |

Ana navigasyon dört bölümden oluşur: Ana Sayfa, Routines, Geçmiş ve Egzersizler. Active Workout ayrı ve odaklanmış bir tam ekran akışıdır.

## 8. Kullanıcı akışları

### 8.1 Boş workout başlatma

```text
Ana Sayfa
→ Yeni Workout
→ Boş Workout
→ Egzersiz Ekle
→ Set Bilgilerini Gir
→ Seti Tamamla
→ Workout'ı Bitir
→ Workout Detail
```

### 8.2 Routine üzerinden workout başlatma

```text
Ana Sayfa veya Routines
→ Routine Seç
→ Workout Başlat
→ Egzersizler Otomatik Eklenir
→ Setleri Kaydet
→ Workout'ı Bitir
```

### 8.3 Aktif workout recovery

```text
Aktif Workout
→ Uygulama Kapanır
→ Uygulama Yeniden Açılır
→ Aktif Workout Algılanır
→ Ana Sayfadan Devam Et
```

### 8.4 Özel egzersiz oluşturma

```text
Egzersizler veya Egzersiz Seçici
→ Yeni Egzersiz
→ Ad + Kas Grubu + Kategori
→ Kaydet
→ Egzersiz Listesinde Kullan
```

### 8.5 Progress görüntüleme

```text
Egzersizler veya Workout Detail
→ Egzersiz Seç
→ Exercise Progress
→ Tarih Bazlı Set Geçmişi
```

## 9. Fonksiyonel gereksinimler

| Kimlik | Gereksinim |
| --- | --- |
| FR-001 | Kullanıcı boş veya routine tabanlı workout başlatabilmelidir. |
| FR-002 | Sistem aynı anda birden fazla aktif workout oluşturmamalıdır. |
| FR-003 | Workout süresi başlangıç ve bitiş zamanından güvenilir biçimde hesaplanmalıdır. |
| FR-004 | Kullanıcı aktif workout'a egzersiz ekleyebilmeli ve kaldırabilmelidir. |
| FR-005 | Kullanıcı egzersize set ekleyebilmeli ve silebilmelidir. |
| FR-006 | Bir set ağırlık, tekrar ve tamamlanma durumu taşımalıdır. |
| FR-007 | Anlamlı her workout değişikliği yerel veritabanına gecikmeden kaydedilmelidir. |
| FR-008 | Aktif workout uygulama yeniden açıldığında geri yüklenmelidir. |
| FR-009 | Tamamlanan workout geçmiş listesinde görünmelidir. |
| FR-010 | Geçmiş workout detayları sonradan yapılan egzersiz adı değişikliklerinden etkilenmemelidir. |
| FR-011 | Kullanıcı routine oluşturabilmeli, düzenleyebilmeli ve silebilmelidir. |
| FR-012 | Routine'deki egzersizler yeni workout'a sıralı biçimde kopyalanmalıdır. |
| FR-013 | Kullanıcı özel egzersiz oluşturabilmelidir. |
| FR-014 | Daha önce kullanılmış egzersiz kalıcı silinmek yerine arşivlenmelidir. |
| FR-015 | Kullanıcı bir egzersizin tamamlanan set geçmişini görebilmelidir. |
| FR-016 | Tüm MVP özellikleri internet bağlantısı olmadan çalışmalıdır. |

## 10. Fonksiyonel olmayan gereksinimler

### Kullanılabilirlik

- Active Workout işlemleri tek elle kullanılabilir olmalıdır.
- Birincil dokunma alanları en az 44–48 dp hedeflemelidir.
- Set satırında ağırlık, tekrar ve tamamla kontrolü birlikte erişilebilir olmalıdır.
- Kritik silme, iptal ve bitirme işlemlerinde doğrulama kullanılmalıdır.
- Kullanıcıya belirsiz teknik hata mesajı gösterilmemelidir.

### Performans

- Yerel veriyle çalışan temel ekranlar algılanabilir bekleme oluşturmamalıdır.
- Tipik kullanım verisinde liste ve veri yazma işlemleri hızlı kalmalıdır.
- Uzun geçmiş listeleri gerektiğinde sayfalama veya kademeli yükleme destekleyebilmelidir.

### Güvenilirlik

- Tamamlanan set verisi uygulama kapanmasında kaybolmamalıdır.
- Birden fazla tabloyu etkileyen kritik yazmalar transaction içinde yapılmalıdır.
- Veritabanı foreign key kontrolleri etkin olmalıdır.
- Şema değişiklikleri sürümlü migration ile yapılmalıdır.

### Bakım kolaylığı

- TypeScript strict mode kullanılmalıdır.
- Ekranlar doğrudan SQL sorgusu çalıştırmamalıdır.
- Domain, veri erişimi ve UI sorumlulukları ayrılmalıdır.
- Tekrarlanan UI kalıpları ortak bileşenlerde toplanmalıdır.

### Erişilebilirlik

- Yalnız renge bağlı durum anlatımı kullanılmamalıdır.
- Kontroller erişilebilir adlara sahip olmalıdır.
- Metin ve arka plan kontrastı okunabilir olmalıdır.
- Dinamik metin büyütme, temel ekranları kullanılmaz hale getirmemelidir.

## 11. Veri gereksinimleri

Temel yerel varlıklar:

- Exercises
- Routines
- Routine Exercises
- Workouts
- Workout Exercises
- Workout Sets
- App Settings

Veri kuralları:

- Kimlikler cihaz içinde benzersiz olmalıdır.
- Ağırlık negatif olamaz.
- Tekrar sayısı negatif olamaz ve tam sayı olmalıdır.
- Workout içindeki egzersiz ve set sırası açıkça saklanmalıdır.
- Tamamlanan workout verileri geriye dönük olarak değişmemelidir.
- Egzersiz adı ve kas grubu workout kaydında snapshot olarak tutulmalıdır.
- Tarihler cihaz saatinden alınır ve tutarlı bir formatta saklanır.

## 12. Offline kullanım yaklaşımı

- SQLite, kalıcı verinin ana kaynağıdır.
- Ağ bağlantısı MVP'nin hiçbir temel akışında gerekli değildir.
- Workout işlemleri önce yerel veriye yazılır.
- Aktif workout yalnızca geçici bellek durumunda tutulmaz.
- Gelecekte cloud sync eklenebilmesi için UI doğrudan SQLite'a bağlanmaz; repository arayüzleri kullanılır.
- MVP'de arka planda senkronizasyon, kullanıcı hesabı veya çakışma çözümü yoktur.

## 13. Hata durumları

| Durum | Beklenen davranış |
| --- | --- |
| Aktif workout varken yenisi başlatılır | Kullanıcı mevcut workout'a yönlendirilir veya önce bitirme/iptal etme seçeneği sunulur. |
| Egzersiz adı boş bırakılır | Kaydetme engellenir ve alan düzeyinde açıklama gösterilir. |
| Ağırlık veya tekrar geçersizdir | Set tamamlanamaz; hatalı alan belirtilir. |
| Workout'ta tamamlanmış set yoktur | Bitirme öncesi açık uyarı ve onay gösterilir. |
| Tamamlanmamış setler vardır | Bitirme öncesi bilgilendirme ve onay gösterilir; veri korunur. |
| Kullanılmış egzersiz silinmek istenir | Kalıcı silme yerine arşivleme uygulanır. |
| Veritabanı yazma işlemi başarısız olur | Başarı mesajı gösterilmez; kullanıcıya tekrar deneme ve güvenli geri dönüş sunulur. |
| Uygulama workout sırasında kapanır | Son başarıyla kaydedilmiş durum açılışta geri yüklenir. |
| Routine'deki egzersiz arşivlenmiştir | Routine editöründe durum belirtilir; yeni workout'a sessizce hatalı veri eklenmez. |

## 14. MVP başarı kriterleri

MVP aşağıdaki koşullar birlikte sağlandığında tamamlanmış kabul edilir:

- İnternet kapalıyken boş ve routine tabanlı workout akışları tamamlanabilir.
- Aktif workout uygulama yeniden başlatıldığında geri gelir.
- Ağırlık, tekrar ve tamamlanma bilgileri doğru saklanır.
- Tamamlanan workout geçmişte doğru tarih, süre, egzersiz ve setlerle görünür.
- Egzersiz progress geçmişi yalnız ilgili ve tamamlanmış workout verilerinden üretilir.
- Egzersiz düzenleme veya arşivleme eski workout geçmişini bozmaz.
- Kritik kullanıcı akışları otomatik ve manuel testlerden geçer.
- Desteklenen telefon boyutlarında ana eylemler rahat kullanılabilir.
- Veri kaybına veya uygulamanın kullanılamamasına yol açan bilinen kritik hata bulunmaz.
- Kod, dokümantasyon ve Memory Bank güncel durumla çelişmez.

## 15. Gelecekte eklenebilecek özellikler

Roadmap sıralaması MVP sonuçlarına göre değişebilir. İlk değerlendirme grupları:

1. Kullanım hızını artıran özellikler: rest timer, önceki seti gösterme, hızlı kopyalama.
2. Progress özellikleri: PR, 1RM, volume ve grafikler.
3. Gelişmiş workout yapıları: superset, drop set, RPE/RIR.
4. Veri taşınabilirliği: export/import ve backup/restore.
5. Cihazlar arası kullanım: hesap ve cloud sync.
6. Sağlık platformları ve wearable entegrasyonları.
7. AI destekli öneriler; yalnız güvenilir veri ve açık kullanıcı kontrolü sağlandıktan sonra.
