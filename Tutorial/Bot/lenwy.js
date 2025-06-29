/* Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

*/

// Import Module
require('./len')
require('./database/Menu/LenwyMenu')
const fs = require('fs');
const axios = require('axios');

// Import Scrape
const Ai4Chat = require('./scrape/Ai4Chat');
const tiktok2 = require('./scrape/Tiktok');

module.exports = async (lenwy, m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || "Lenwy";
    const args = body.slice(1).trim().split(" ");
    const command = args.shift().toLowerCase();
    const q = args.join(" ");

    if (!body.startsWith(prefix)) return;

    const lenwyreply = (teks) => lenwy.sendMessage(sender, { text: teks }, { quoted: msg });
    const isGroup = sender.endsWith('@g.us');
    const isAdmin = (admin.includes(sender))
    const menuImage = fs.readFileSync(image);

switch (command) {

// Menu
case "menu": {
    await lenwy.sendMessage(sender,
        {
            image: menuImage,
            caption: lenwymenu,
            mentions: [sender]
        },
    { quoted: msg }
    )
}
break

// Hanya Admin
case "admin": {
    if (!isAdmin) return lenwyreply(mess.admin); // COntoh Penerapan Hanya Admin
    lenwyreply("🎁 *Kamu Adalah Admin*"); // Admin Akan Menerima Pesan Ini
}
break

// Hanya Group
case "group": {
    if (!isGroup) return lenwyreply(mess.group); // Contoh Penerapan Hanya Group
    lenwyreply("🎁 *Kamu Sedang Berada Di Dalam Grup*"); // Pesan Ini Hanya Akan Dikirim Jika Di Dalam Grup
}
break

// AI Chat
case "ai": {
    if (!q) return lenwyreply("☘️ *Contoh:* !ai Apa itu kondom?");
        lenwyreply(mess.wait);
    try {
        const lenai = await Ai4Chat(q);
            await lenwyreply(`*KATA ERWE*\n\n${lenai}`);
                } catch (error) {
            console.error("Error:", error);
        lenwyreply(mess.error);
    }
}
break;

case "ttdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Tiktoknya?*");
        lenwyreply(mess.wait);
    try {
        const result = await tiktok2(q); // Panggil Fungsi Scraper

            // Kirim Video
            await lenwy.sendMessage(
                sender,
                    {
                        video: { url: result.no_watermark },
                        caption: `*🎁 Lenwy Tiktok Downloader*`
                    },
                { quoted: msg }
            );

        } catch (error) {
            console.error("Error TikTok DL:", error);
        lenwyreply(mess.error);
    }
}
break;

case "igdl": {
    if (!q) return lenwyreply("⚠ *Mana Link Instagramnya?*");
    try {
        lenwyreply(mess.wait);

        // Panggil API Velyn
        const apiUrl = `https://www.velyn.biz.id/api/downloader/instagram?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.data.url[0]) {
            throw new Error("Link tidak valid atau API error");
        }

        const data = response.data.data;
        const mediaUrl = data.url[0];
        const metadata = data.metadata;

        // Kirim Media
        if (metadata.isVideo) {
            await lenwy.sendMessage(
                sender,
                    {
                        video: { url: mediaUrl },
                        caption: `*Instagram Reel*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n` +
                            `*Comments :* ${metadata.comment.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}\n\n` +
                            `*Source :* ${q}`
                    },
                    { quoted: msg }
                );
        } else {
            await lenwy.sendMessage(
                sender,
                    {
                        image: { url: mediaUrl },
                        caption: `*Instagram Post*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}`
                    },
                    { quoted: msg }
                );
            }

        } catch (error) {
            console.error("Error Instagram DL:", error);
        lenwyreply(mess.error);
    }
}
break;

// Game Tebak Angka
case "tebakangka": {
    const target = Math.floor(Math.random() * 100);
        lenwy.tebakGame = { target, sender };
    lenwyreply("*Tebak Angka 1 - 100*\n*Ketik !tebak [Angka]*");
}
break;

case "tebak": {
    if (!lenwy.tebakGame || lenwy.tebakGame.sender !== sender) return;
        const guess = parseInt(args[0]);
    if (isNaN(guess)) return lenwyreply("❌ *Masukkan Angka!*");

    if (guess === lenwy.tebakGame.target) {
        lenwyreply(`🎉 *Tebakkan Kamu Benar!*`);
            delete lenwy.tebakGame;
        } else {
            lenwyreply(guess > lenwy.tebakGame.target ? "*Terlalu Tinggi!*" : "*Terlalu rendah!*");
    }
}
break;

case "quote": {
    const quotes = [
        "Ulah poho kana dahar xia.",
        "Sakirana hayang modol tong ditahan.",
        "Bagjakeun kanu jadi kolot maraneh",
        "Hidup ini singkat, moal bisa diperpanjang ka samsat."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    lenwyreply(`*Quote Hari Ini :*\n_"${randomQuote}"_`);
}
break;

// --- FITUR RUMUS TEKNIK MESIN ---
//
// Cara Penggunaan:
// !stress [gaya] [luas]
// !strain [perubahan_panjang] [panjang_awal]
// !modulus [tegangan] [regangan]
// !energi_kinetik [massa] [kecepatan]
// !konduksi [konduktivitas] [luas] [perubahan_suhu] [tebal]
// ---------------------------------

// Rumus 1: Tegangan (Stress)
// Rumus: σ = F / A (Gaya dibagi Luas Penampang)
case "stress":
case "hitungstress": {
    // Memeriksa apakah pengguna memberikan 2 argumen (Gaya dan Luas)
    if (args.length < 2) {
        return lenwyreply("⚙️ *Contoh:* !stress 1000 0.5\n\n_Hitung tegangan (stress) dengan format: !stress [Gaya (N)] [Luas (m²)]_");
    }

    // Mengubah argumen menjadi angka
    const force = parseFloat(args[0]);
    const area = parseFloat(args[1]);

    // Memvalidasi input
    if (isNaN(force) || isNaN(area)) {
        return lenwyreply("❌ *Input harus berupa angka!* Contoh: !stress 1000 0.5");
    }

    // Memeriksa pembagian dengan nol
    if (area === 0) {
        return lenwyreply("❌ *Luas penampang tidak boleh nol!*");
    }

    // Menghitung tegangan
    const stress = force / area;

    // Mengirim hasil ke pengguna
    lenwyreply(`*⚙️ Hasil Perhitungan Tegangan (Stress)*\n\n` +
               `*Gaya (F):* ${force} N\n` +
               `*Luas (A):* ${area} m²\n` +
               `*Tegangan (σ):* ${stress.toFixed(2)} Pa (Pascal)`);
}
break;

// Rumus 2: Regangan (Strain)
// Rumus: ε = ΔL / L₀ (Perubahan Panjang dibagi Panjang Awal)
case "strain":
case "hitungregangan": {
    if (args.length < 2) {
        return lenwyreply("⚙️ *Contoh:* !strain 0.05 100\n\n_Hitung regangan (strain) dengan format: !strain [Perubahan Panjang (m)] [Panjang Awal (m)]_");
    }
    const deltaL = parseFloat(args[0]);
    const L0 = parseFloat(args[1]);

    if (isNaN(deltaL) || isNaN(L0)) {
        return lenwyreply("❌ *Input harus berupa angka!*");
    }

    if (L0 === 0) {
        return lenwyreply("❌ *Panjang awal tidak boleh nol!*");
    }

    const strain = deltaL / L0;
    lenwyreply(`*⚙️ Hasil Perhitungan Regangan (Strain)*\n\n` +
               `*Perubahan Panjang (ΔL):* ${deltaL} m\n` +
               `*Panjang Awal (L₀):* ${L0} m\n` +
               `*Regangan (ε):* ${strain.toFixed(4)} (tanpa satuan)`);
}
break;

// Rumus 3: Modulus Elastisitas (Modulus of Elasticity)
// Rumus: E = σ / ε (Tegangan dibagi Regangan)
case "modulus":
case "moduluselastisitas": {
    if (args.length < 2) {
        return lenwyreply("⚙️ *Contoh:* !modulus 100000 0.001\n\n_Hitung Modulus Elastisitas (E) dengan format: !modulus [Tegangan (Pa)] [Regangan (tanpa satuan)]_");
    }
    const stress = parseFloat(args[0]);
    const strain = parseFloat(args[1]);

    if (isNaN(stress) || isNaN(strain)) {
        return lenwyreply("❌ *Input harus berupa angka!*");
    }

    if (strain === 0) {
        return lenwyreply("❌ *Regangan tidak boleh nol!*");
    }

    const modulus = stress / strain;
    lenwyreply(`*⚙️ Hasil Perhitungan Modulus Elastisitas (E)*\n\n` +
               `*Tegangan (σ):* ${stress} Pa\n` +
               `*Regangan (ε):* ${strain}\n` +
               `*Modulus Elastisitas (E):* ${modulus.toExponential(2)} Pa (Pascal)`);
}
break;

// Rumus 4: Energi Kinetik (Kinetic Energy)
// Rumus: KE = 0.5 * m * v² (0.5 * massa * kecepatan²)
case "energi_kinetik":
case "ke": {
    if (args.length < 2) {
        return lenwyreply("⚙️ *Contoh:* !ke 10 5\n\n_Hitung energi kinetik dengan format: !ke [Massa (kg)] [Kecepatan (m/s)]_");
    }
    const mass = parseFloat(args[0]);
    const velocity = parseFloat(args[1]);

    if (isNaN(mass) || isNaN(velocity)) {
        return lenwyreply("❌ *Input harus berupa angka!*");
    }

    const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2);
    lenwyreply(`*⚙️ Hasil Perhitungan Energi Kinetik (KE)*\n\n` +
               `*Massa (m):* ${mass} kg\n` +
               `*Kecepatan (v):* ${velocity} m/s\n` +
               `*Energi Kinetik (KE):* ${kineticEnergy.toFixed(2)} J (Joule)`);
}
break;

// Rumus 5: Perpindahan Panas Konduksi (Heat Conduction)
// Rumus: Q = (k * A * ΔT) / Δx
case "konduksi":
case "konduksipanas": {
    if (args.length < 4) {
        return lenwyreply("⚙️ *Contoh:* !konduksi 50 2 20 0.1\n\n_Hitung laju perpindahan panas: !konduksi [Konduktivitas (k)] [Luas (A)] [Suhu (ΔT)] [Tebal (Δx)]_");
    }
    const k = parseFloat(args[0]); // Konduktivitas termal
    const A = parseFloat(args[1]); // Luas penampang
    const deltaT = parseFloat(args[2]); // Perubahan suhu
    const deltaX = parseFloat(args[3]); // Tebal material

    if (isNaN(k) || isNaN(A) || isNaN(deltaT) || isNaN(deltaX)) {
        return lenwyreply("❌ *Input harus berupa angka!*");
    }

    if (deltaX === 0) {
        return lenwyreply("❌ *Tebal tidak boleh nol!*");
    }

    const heatTransfer = (k * A * deltaT) / deltaX;
    lenwyreply(`*⚙️ Hasil Perhitungan Konduksi Panas (Q)*\n\n` +
               `*Konduktivitas (k):* ${k} W/m·K\n` +
               `*Luas (A):* ${A} m²\n` +
               `*Perubahan Suhu (ΔT):* ${deltaT} K\n` +
               `*Tebal (Δx):* ${deltaX} m\n` +
               `*Laju Perpindahan Panas (Q):* ${heatTransfer.toFixed(2)} W (Watt)`);
}
break;

        default: { lenwyreply(mess.default) }
    }
} 