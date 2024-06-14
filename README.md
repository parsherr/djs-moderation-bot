# Discord.js v14 Slashlı Moderasyon Botu


## Kurulum
1. **Ayarlar Dosyasını Düzenleyin:**
    - `ayarlar.json` dosyasını açın ve aşağıdaki alanları kendi bilgilerinizle doldurun:
    ```json
    {
      "sahip": "Kendi Discord ID'nizi buraya yazın",
      "token": "Botunuzun tokenini buraya yazın"
    }
    ```
    
2. **Gerekli Paketleri Yükleyin:**
    - Proje dizininde terminali açın ve aşağıdaki komutu çalıştırın:
    ```bash
    npm install
    ```
3. **Botu Başlatın:**
    - `başlat.bat` dosyasını çalıştırın. //node .

## Kullanım

Botun mevcut tüm komutlarını ve açıklamalarını görmek için `/yardım` komutunu kullanabilirsiniz.

## Destek

Herhangi bir sorunla karşılaşırsanız veya yardım almak isterseniz, [benimle iletişime](https://discord.com/users/657241749579759616) geçebilirsiniz.

---

[![Discord Banner](https://api.weblutions.com/discord/invite/bdfd/)](https://discord.gg/bdfd)



# Başlat.bat yapımı :
aşağadaki kodu kopyalayıp "start.bat" isimli bi dosya açın, kopyaladığınız metni bat dosyasına girin.

    ```bash
    echo off
    color 0f
    cls
    :a
    node index.js
    goto a
    ```