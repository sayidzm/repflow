# AI Coding Guidelines

> Bu dosya projede çalışan tüm AI coding agent'ları için bağlayıcıdır.  
> Belge sürümü: 1.0  
> Son güncelleme: 2026-08-18

## 1. Zorunlu başlangıç protokolü

Her AI agent herhangi bir dosya oluşturmadan, kod değiştirmeden, dependency eklemeden veya teknik karar vermeden önce aşağıdaki sırayı izlemelidir:

```text
READ ai_guidelines.md
↓
READ memory-bank/README.md
↓
READ ilgili Memory Bank dosyaları
↓
READ prd.md ve project_goals.md
↓
INSPECT mevcut kod ve proje durumu
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
UPDATE MEMORY BANK
```

Bu okuma adımı isteğe bağlı değildir. Yeni oturumda proje hakkında tahminde bulunmak yerine belgelerden güncel bağlam alınmalıdır.

## 2. Kaynak önceliği

Çelişki olduğunda öncelik sırası:

1. Kullanıcının mevcut görevdeki açık talimatı
2. `ai_guidelines.md`
3. `prd.md`
4. `project_goals.md`
5. `memory-bank/decisions.md`
6. Diğer Memory Bank dosyaları
7. Mevcut kod davranışı

Kod ile dokümantasyon çelişirse çelişki görmezden gelinmemelidir. Değişiklik yapmadan önce hangi kaynağın güncel olduğu belirlenmeli; belirsizlik ürün kapsamını veya mimariyi etkiliyorsa kullanıcıdan onay istenmelidir.

## 3. Planlama kuralları

Değişiklikten önce:

- İstenen sonucu kısa biçimde yeniden ifade et.
- İlgili dosya ve modülleri incele.
- Mevcut çalışan davranışı belirle.
- Değişikliğin veri modeli, mimari ve testlere etkisini değerlendir.
- En küçük güvenli değişiklik kapsamını çıkar.
- Büyük veya geri dönüşü zor kararları kullanıcı onayına sun.

Küçük ve yerel bir düzeltme için gereksiz geniş plan veya refactor oluşturma.

## 4. MVP kapsamını koruma

- Kullanıcının istemediği özellikleri ekleme.
- `prd.md` içindeki MVP dışı özellikleri otomatik olarak geliştirme.
- Gelecekte gerekebilir düşüncesiyle backend, hesap sistemi veya cloud sync ekleme.
- Yeni fikirleri uygulamak yerine gerekirse `memory-bank/roadmap.md` içine aday olarak yaz.
- Bir isteğin MVP sınırını değiştirdiğini düşünüyorsan uygulamadan önce bunu açıkça belirt ve onay al.

## 5. Mevcut kodu koruma

- Önce mevcut projeyi incele, sonra değişiklik yap.
- Çalışan özellikleri sebepsiz yere yeniden yazma.
- Küçük bir sorun için büyük refactor yapma.
- Hata düzeltirken yalnızca gerekli dosya ve satırlara müdahale et.
- Kullanıcı açıkça istemedikçe tüm dosyayı veya modülü baştan yazma.
- İlgisiz kullanıcı değişikliklerini geri alma veya biçimlendirme.
- Silme ya da veri kaybı oluşturabilecek işlemlerde hedefi doğrulamadan hareket etme.

## 6. Mimari kuralları

- Büyük mimari kararları kullanıcı onayı olmadan değiştirme.
- UI, domain ve persistence sorumluluklarını ayır.
- Ekran bileşenlerine doğrudan SQL sorgusu yerleştirme.
- SQLite erişimini repository katmanında tut.
- Birden fazla tabloyu etkileyen kritik yazmaları transaction içinde yap.
- Şema değişikliklerini yalnızca sürümlü migration ile uygula.
- Active workout'ın kalıcılığını yalnız in-memory state'e bağlama.
- Gelecekteki cloud sync için şimdiden kullanılmayan altyapı yazma.

## 7. Dependency kuralları

Yeni dependency eklemeden önce:

1. Mevcut araçlarla çözülemeyen gerçek ihtiyacı belirle.
2. Kütüphanenin bakım durumunu ve platform uyumluluğunu kontrol et.
3. Bundle, native build ve test etkisini değerlendir.
4. Aynı işi yapan mevcut dependency olmadığını doğrula.
5. Gerekçeyi önemliyse `memory-bank/decisions.md` içine kaydet.

Gereksiz UI kit, ORM, state-management veya utility kütüphanesi ekleme.

## 8. Component ve design system kuralları

- Mevcut design token ve shared component sistemini yeniden kullan.
- Aynı işi yapan duplicate component oluşturma.
- Yeni ortak component oluşturmadan önce mevcutları ara.
- Feature'a özgü bileşeni gereksiz yere global shared component yapma.
- Active Workout ekranında büyük dokunma alanları ve tek elle kullanım önceliklidir.
- Yalnız renkle durum belirtme; erişilebilir label ve görsel durum desteği kullan.
- Görsel iyileştirme için çalışan iş mantığını değiştirme.

## 9. Type safety ve kod kalitesi

- TypeScript strict mode kurallarını koru.
- Gerekçesiz `any`, type assertion veya `@ts-ignore` kullanma.
- Domain değerleri için açık tipler kullan.
- Kullanıcı girdilerini veri katmanına geçmeden doğrula.
- Negatif ağırlık ve negatif/ondalıklı tekrar gibi geçersiz değerleri engelle.
- Fonksiyon ve değişken adları sorumluluğu açıkça anlatmalıdır.
- Karmaşık domain davranışını yorum yerine test ve iyi isimlendirmeyle açıkla.
- Sessiz catch blokları oluşturma.

## 10. Veri güvenilirliği

- Kullanıcıya başarı durumu göstermeden önce kalıcı yazmanın başarılı olduğunu doğrula.
- Workout geçmişini bozabilecek hard delete işlemlerinden kaçın.
- Egzersiz düzenlemelerinin eski workout snapshot'larını değiştirmesine izin verme.
- Zaman verisini tutarlı formatta sakla.
- Workout süresini artan sayaç değerinden değil zaman damgalarından hesapla.
- Migration sırasında mevcut veriyi koru.
- Veri modelini değiştirmeden önce `memory-bank/data-model.md` dosyasını incele ve güncelle.

## 11. Test kuralları

Her değişiklik için uygun olanları çalıştır:

- Type-check
- Lint
- Unit tests
- Repository/integration tests
- İlgili ekran component testleri
- Kritik kullanıcı akışlarının manuel kontrolü

Bir test başarısızsa:

- Testi yalnızca geçmesi için gevşetme veya silme.
- Önce hatanın testte mi yoksa uygulamada mı olduğunu belirle.
- İlgisiz başarısız testleri raporla; görev kapsamı dışında sessizce düzeltme.

## 12. Hata düzeltme protokolü

1. Hatayı yeniden üret veya güvenilir kanıtla doğrula.
2. Kök nedeni belirle.
3. Etkilenen en küçük kod alanını seç.
4. Düzeltmeyi uygula.
5. Hatanın tekrarını önleyen test ekle veya güncelle.
6. İlgili regresyon kontrollerini çalıştır.
7. Sonucu kısa ve kanıta dayalı raporla.

## 13. Memory Bank güncelleme kuralları

Her anlamlı geliştirme sonunda:

- `memory-bank/progress.md`: Tamamlanan işi ve doğrulamayı ekle.
- `memory-bank/current-state.md`: Güncel çalışan, eksik ve sıradaki durumu yaz.
- `memory-bank/decisions.md`: Önemli teknik karar ve gerekçeyi ekle.
- `memory-bank/data-model.md`: Şema veya veri kuralı değiştiyse güncelle.
- `memory-bank/architecture.md`: Katman veya modül sınırı değiştiyse güncelle.
- `memory-bank/testing.md`: Test yaklaşımı veya kritik senaryo değiştiyse güncelle.
- `memory-bank/roadmap.md`: Kapsam veya faz sıralaması onayla değiştiyse güncelle.

Kurallar:

- Eski veya artık geçerli olmayan bilgileri aktif durum dosyalarında bırakma.
- `progress.md` geçmiş kaydıdır; daha önce doğru olan tamamlanmış kayıtları silme.
- Tahmini bilgiyi gerçekleşmiş gibi yazma.
- Test edilmemiş özelliği tamamlandı olarak işaretleme.
- Dokümantasyon ile gerçek kod arasında çelişki oluşturma.

## 14. Karar kaydı formatı

Önemli kararlar `decisions.md` içinde şu bilgilerle tutulmalıdır:

- Karar kimliği
- Tarih
- Durum: Proposed, Accepted, Superseded veya Rejected
- Bağlam
- Karar
- Gerekçe
- Sonuçlar ve trade-off'lar
- Varsa yerine geçtiği karar

## 15. Görev sonu raporu

Her uygulama görevi sonunda kısa biçimde raporla:

1. Ne değişti?
2. Hangi dosyalar etkilendi?
3. Hangi test ve kontroller çalıştırıldı?
4. Bilinen risk veya eksik var mı?
5. Memory Bank nasıl güncellendi?
6. Sonraki mantıklı adım nedir?

## 16. Yasaklanan çalışma biçimleri

- Kullanıcı onayı olmadan MVP kapsamını genişletmek
- Çalışan modülü gerekçesiz tamamen yeniden yazmak
- Aynı sorunu çözen ikinci sistem oluşturmak
- Testleri veya type safety'yi geçici olarak devre dışı bırakmak
- Şema değişikliğini migration olmadan yapmak
- Gizli backend veya ağ bağımlılığı eklemek
- Başarısız işlemi başarılı gibi raporlamak
- İncelenmemiş kod hakkında kesin iddiada bulunmak
- Memory Bank'i güncellemeden anlamlı özelliği tamamlandı saymak
