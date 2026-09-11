# Huzur İslamda

Mobil öncelikli, ücretsiz ve reklamsız namaz vakti uygulaması.

## Vakit verisi

Uygulama cihazın konum iznini ister ve koordinata göre güncel vakitleri
Aladhan servisinden `method=13` parametresiyle alır. Bu parametre Diyanet
hesaplama parametrelerini hedefleyen bir üçüncü taraf hesaplama yöntemidir;
**resmî Diyanet/AwqatSalah verisi değildir**. İnternet veya servis erişimi
yoksa son başarılı sonuç cihaz önbelleğinden gösterilir.

Resmî Diyanet AwqatSalah kullanımı için hesap/token ve güvenli bir backend
gereklidir; token mobil uygulamaya gömülmemelidir.

## Çalıştırma

```bash
npm install
npm run dev
```

## Android APK

```bash
npm run android:build
```
