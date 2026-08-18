# Memory Bank — Kullanım Rehberi

> Amaç: Projenin kalıcı teknik hafızasını korumak  
> Son güncelleme: 2026-08-18

## 1. Memory Bank'in rolü

Memory Bank, yeni bir AI coding agent oturumunun projeyi sıfırdan tahmin etmesini önler. Ürünün kapsamı, kabul edilmiş kararlar, mevcut kod durumu, tamamlanan işler ve sıradaki adımlar burada tutulur.

Memory Bank, kaynak kodun yerine geçmez. Kodun güncel davranışı ile belgeler arasında çelişki tespit edilirse çelişki çözülmeli ve belgeler yeniden güncellenmelidir.

## 2. Zorunlu okuma sırası

Her geliştirme oturumunda:

1. `/ai_guidelines.md`
2. `/memory-bank/README.md`
3. `/memory-bank/project-context.md`
4. `/memory-bank/current-state.md`
5. `/memory-bank/decisions.md`
6. Görevle ilgili dosyalar:
   - Mimari görev: `architecture.md`
   - Veri görevi: `data-model.md`
   - Test görevi: `testing.md`
   - Planlama görevi: `roadmap.md`
7. `/prd.md`
8. `/project_goals.md`
9. Mevcut kaynak kod ve testler

## 3. Dosyaların görevleri

| Dosya | Sorumluluk |
| --- | --- |
| `project-context.md` | Ürünün amacı, kullanıcı, kapsam ve temel ilkeler |
| `architecture.md` | Teknik yığın, katmanlar, modül sınırları ve veri akışı |
| `data-model.md` | SQLite tabloları, ilişkiler, kısıtlar ve migration kuralları |
| `decisions.md` | Kabul edilen, reddedilen veya değiştirilen önemli kararlar |
| `current-state.md` | Şu anda gerçekten çalışan, eksik ve sıradaki durum |
| `progress.md` | Tarihsel geliştirme günlüğü ve doğrulama sonuçları |
| `testing.md` | Test stratejisi, kritik senaryolar ve MVP kabul kontrolleri |
| `roadmap.md` | MVP fazları ve onay gerektiren MVP sonrası adaylar |

## 4. Güncelleme kuralları

- `current-state.md` yalnızca güncel gerçeği anlatır; eski durum metni bırakılmaz.
- `progress.md` tarihsel kayıttır; daha önce doğru yazılmış tamamlanmış kayıtlar silinmez.
- `decisions.md` içindeki eski karar silinmez; yerine geçen karar `Superseded` olarak işaretlenir.
- Şema değiştiğinde `data-model.md` aynı görev içinde güncellenir.
- Mimari sınır değiştiğinde `architecture.md` aynı görev içinde güncellenir.
- MVP kapsamı yalnız kullanıcı onayıyla değiştirilebilir.
- Test edilmemiş iş `completed` veya tamamlandı olarak yazılmaz.
- Planlanan özellik ile uygulanmış özellik açıkça ayrılır.

## 5. Oturum başlangıç kontrolü

- [ ] Zorunlu belgeler okundu.
- [ ] `current-state.md` içindeki aktif faz ve bilinen sorunlar kontrol edildi.
- [ ] Görevle ilgili mevcut dosyalar ve testler incelendi.
- [ ] Değişiklik kapsamı ve kabul kriterleri belirlendi.
- [ ] Büyük karar veya kapsam değişikliği varsa kullanıcı onayı alındı.

## 6. Oturum bitiş kontrolü

- [ ] İlgili testler çalıştırıldı.
- [ ] Regresyon riski kontrol edildi.
- [ ] `progress.md` güncellendi.
- [ ] `current-state.md` güncellendi.
- [ ] Gerekliyse `decisions.md` güncellendi.
- [ ] Gerekliyse mimari, veri modeli, test veya roadmap belgeleri güncellendi.
- [ ] Dokümantasyon ile kod arasında bilinen çelişki kalmadı.

## 7. Belge durumu etiketleri

- `Planned`: Onaylı fakat uygulanmamış
- `In Progress`: Uygulanmakta
- `Implemented`: Kodlanmış
- `Verified`: Test ve kontrollerle doğrulanmış
- `Blocked`: Devam etmek için karar veya dış koşul gerekli
- `Superseded`: Daha yeni bir karar veya yapı tarafından değiştirilmiş
