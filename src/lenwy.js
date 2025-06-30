/* Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

  -- FILE INI TELAH DIADAPTASI UNTUK WHATSAPP-WEB.JS --

*/

// Import modul menggunakan sintaks ESM
// CATATAN: Files lokal ini harus menggunakan `export` atau `export default`
import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Impor variabel global dari file len.js dan LenwyMenu.js
import { prefix, admin, mess, image } from './len.js'; // Pastikan len.js diekspor dengan `export { ... }`
import { lenwymenu } from './database/Menu/LenwyMenu.js'; // Pastikan file ini diekspor dengan `export { ... }`
import Ai4Chat from './scrape/Ai4Chat.js'; // Pastikan Ai4Chat.js diekspor dengan `export default`
import tiktok2 from './scrape/Tiktok.js'; // Pastikan Tiktok.js diekspor dengan `export default`

// Dapatkan __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Ekspor handler pesan sebagai default untuk ESM
export default async (client, message) => { // Ubah parameter dari (lenwy, m) menjadi (client, message)
    // 1. Adaptasi objek pesan dari whatsapp-web.js
    const body = message.body || "";
    const sender = message.from;
    
    // Dapatkan nama pengirim dengan cara yang lebih aman
    let pushname = message._data?.notifyName || "Lenwy";

    // 2. ADAPTASI FUNGSI REPLY: Menggunakan client.sendMessage()
    const lenwyreply = async (teks, quotedMessage) => {
        await client.sendMessage(sender, teks, { quotedMessageId: quotedMessage.id._serialized });
    };

    // 3. ADAPTASI CEK GROUP DAN ADMIN (PERBAIKAN)
    // ... di dalam fungsi export default async (client, message) => { ... }

    // ADAPTASI CEK GROUP DAN ADMIN (PERBAIKAN TERAKHIR)
   let chat;
try {
    chat = await message.getChat(); // LEBIH AMAN!
} catch (e) {
    console.error('Gagal mendapatkan chat object:', e.message);
    return;
}
;
// ... lanjutkan dengan kode parsing command ...
   
    
    // 4. Baca gambar menu dengan path yang robust
    const menuImage = fs.readFileSync(path.join(__dirname, '..', image));

    // 5. Parsing command
    if (!body.startsWith(prefix)) return;
    const args = body.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const q = args.join(" ");
    
    // Log untuk diagnosis
    console.log('--- PARSING PERINTAH ---');
    console.log('Perintah terdeteksi:', command);
    console.log('Query:', q);
    console.log('----------------------');

    // 6. Switch untuk command
    switch (command) {

    // Menu
    case "menu": {
        const media = new MessageMedia('image/jpeg', menuImage.toString('base64'));
        await client.sendMessage(sender, media, {
            caption: lenwymenu
        });
    }
    break;

    // Hanya Admin
    case "admin": {
        if (!isAdmin) return lenwyreply(mess.admin, message);
        lenwyreply("🎁 *Kamu Adalah Admin*", message);
    }
    break;

    // Hanya Group
    case "group": {
        if (!isGroup) return lenwyreply(mess.group, message);
        lenwyreply("🎁 *Kamu Sedang Berada Di Dalam Grup*", message);
    }
    break;

    // AI Chat
    // ... di dalam fungsi export default async (client, message) => { ... } ...

// AI Chat
case "ai": {
    console.log('AI command received.'); // Log baru
    if (!q) return lenwyreply("☘️ *Contoh:* !ai Apa itu Kondom?", message);
    lenwyreply(mess.wait, message);
    try {
        console.log('Memanggil Ai4Chat dengan query:', q); // Log baru
        const lenai = await Ai4Chat(q);
        console.log('Respons dari Ai4Chat berhasil diproses.'); // Log baru
        await lenwyreply(`*KATA ERWE*\n\n${lenai}`, message);
    } catch (error) {
        console.error("Error pada fitur AI (di lenwy.js):", error); // Log lebih spesifik
        lenwyreply(mess.error, message);
    }
}
    break;

    case "ttdl": {
        if (!q) return lenwyreply("⚠ *Mana Link Tiktoknya?*", message);
        lenwyreply(mess.wait, message);
        try {
            const result = await tiktok2(q);
            const media = await MessageMedia.fromUrl(result.no_watermark, { unsafeMime: true });
            await client.sendMessage(sender, media, { caption: `*🎁 Lenwy Tiktok Downloader*` });
        } catch (error) {
            console.error("Error TikTok DL:", error);
            lenwyreply(mess.error, message);
        }
    }
    break;

    case "igdl": {
        if (!q) return lenwyreply("⚠ *Mana Link Instagramnya?*", message);
        try {
            lenwyreply(mess.wait, message);
            const apiUrl = `https://www.velyn.biz.id/api/downloader/instagram?url=${encodeURIComponent(q)}`;
            const response = await axios.get(apiUrl);
            if (!response.data.status || !response.data.data.url[0]) {
                throw new Error("Link tidak valid atau API error");
            }
            const data = response.data.data;
            const mediaUrl = data.url[0];
            const metadata = data.metadata;
            const media = await MessageMedia.fromUrl(mediaUrl, { unsafeMime: true });
            const captionText = `*Instagram Post*\n\n*Username :* ${metadata.username}\n*Likes :* ${metadata.like.toLocaleString()}\n*Caption :* ${metadata.caption || '-'}`;
            await client.sendMessage(sender, media, { caption: captionText });
        } catch (error) {
            console.error("Error Instagram DL:", error);
            lenwyreply(mess.error, message);
        }
    }
    break;

    // Game Tebak Angka
    case "tebakangka": {
        const target = Math.floor(Math.random() * 100);
        client.tebakGame = { target, sender };
        lenwyreply("*Tebak Angka 1 - 100*\n*Ketik !tebak [Angka]*", message);
    }
    break;

    case "tebak": {
        if (!client.tebakGame || client.tebakGame.sender !== sender) return;
        const guess = parseInt(args[0]);
        if (isNaN(guess)) return lenwyreply("❌ *Masukkan Angka!*", message);

        if (guess === client.tebakGame.target) {
            lenwyreply(`🎉 *Tebakkan Kamu Benar!*`, message);
            delete client.tebakGame;
        } else {
            lenwyreply(guess > client.tebakGame.target ? "*Terlalu Tinggi!*" : "*Terlalu rendah!*", message);
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
        lenwyreply(`*Quote Hari Ini :*\n_"${randomQuote}"_`, message);
    }
    break;

    // --- FITUR RUMUS TEKNIK MESIN ---
    case "stress":
    case "hitungstress": {
        if (args.length < 2) { return lenwyreply("⚙️ *Contoh:* !stress 1000 0.5\n\n_Hitung tegangan (stress) dengan format: !stress [Gaya (N)] [Luas (m²)]_", message); }
        const force = parseFloat(args[0]);
        const area = parseFloat(args[1]);
        if (isNaN(force) || isNaN(area)) { return lenwyreply("❌ *Input harus berupa angka!* Contoh: !stress 1000 0.5", message); }
        if (area === 0) { return lenwyreply("❌ *Luas penampang tidak boleh nol!*", message); }
        const stress = force / area;
        lenwyreply(`*⚙️ Hasil Perhitungan Tegangan (Stress)*\n\n` + `*Gaya (F):* ${force} N\n` + `*Luas (A):* ${area} m²\n` + `*Tegangan (σ):* ${stress.toFixed(2)} Pa (Pascal)`, message);
    }
    break;

    case "strain":
    case "hitungregangan": {
        if (args.length < 2) { return lenwyreply("⚙️ *Contoh:* !strain 0.05 100\n\n_Hitung regangan (strain) dengan format: !strain [Perubahan Panjang (m)] [Panjang Awal (m)]_", message); }
        const deltaL = parseFloat(args[0]);
        const L0 = parseFloat(args[1]);
        if (isNaN(deltaL) || isNaN(L0)) { return lenwyreply("❌ *Input harus berupa angka!*", message); }
        if (L0 === 0) { return lenwyreply("❌ *Panjang awal tidak boleh nol!*", message); }
        const strain = deltaL / L0;
        lenwyreply(`*⚙️ Hasil Perhitungan Regangan (Strain)*\n\n` + `*Perubahan Panjang (ΔL):* ${deltaL} m\n` + `*Panjang Awal (L₀):* ${L0} m\n` + `*Regangan (ε):* ${strain.toFixed(4)} (tanpa satuan)`, message);
    }
    break;

    case "modulus":
    case "moduluselastisitas": {
        if (args.length < 2) { return lenwyreply("⚙️ *Contoh:* !modulus 100000 0.001\n\n_Hitung Modulus Elastisitas (E) dengan format: !modulus [Tegangan (Pa)] [Regangan (tanpa satuan)]_", message); }
        const stress = parseFloat(args[0]);
        const strain = parseFloat(args[1]);
        if (isNaN(stress) || isNaN(strain)) { return lenwyreply("❌ *Input harus berupa angka!*", message); }
        if (strain === 0) { return lenwyreply("❌ *Regangan tidak boleh nol!*", message); }
        const modulus = stress / strain;
        lenwyreply(`*⚙️ Hasil Perhitungan Modulus Elastisitas (E)*\n\n` + `*Tegangan (σ):* ${stress} Pa\n` + `*Regangan (ε):* ${strain}\n` + `*Modulus Elastisitas (E):* ${modulus.toExponential(2)} Pa (Pascal)`, message);
    }
    break;

    case "energi_kinetik":
    case "ke": {
        if (args.length < 2) { return lenwyreply("⚙️ *Contoh:* !ke 10 5\n\n_Hitung energi kinetik dengan format: !ke [Massa (kg)] [Kecepatan (m/s)]_", message); }
        const mass = parseFloat(args[0]);
        const velocity = parseFloat(args[1]);
        if (isNaN(mass) || isNaN(velocity)) { return lenwyreply("❌ *Input harus berupa angka!*", message); }
        const kineticEnergy = 0.5 * mass * Math.pow(velocity, 2);
        lenwyreply(`*⚙️ Hasil Perhitungan Energi Kinetik (KE)*\n\n` + `*Massa (m):* ${mass} kg\n` + `*Kecepatan (v):* ${velocity} m/s\n` + `*Energi Kinetik (KE):* ${kineticEnergy.toFixed(2)} J (Joule)`, message);
    }
    break;

    case "konduksi":
    case "konduksipanas": {
        if (args.length < 4) { return lenwyreply("⚙️ *Contoh:* !konduksi 50 2 20 0.1\n\n_Hitung laju perpindahan panas: !konduksi [Konduktivitas (k)] [Luas (A)] [Suhu (ΔT)] [Tebal (Δx)]_", message); }
        const k = parseFloat(args[0]);
        const A = parseFloat(args[1]);
        const deltaT = parseFloat(args[2]);
        const deltaX = parseFloat(args[3]);
        if (isNaN(k) || isNaN(A) || isNaN(deltaT) || isNaN(deltaX)) { return lenwyreply("❌ *Input harus berupa angka!*", message); }
        if (deltaX === 0) { return lenwyreply("❌ *Tebal tidak boleh nol!*", message); }
        const heatTransfer = (k * A * deltaT) / deltaX;
        lenwyreply(`*⚙️ Hasil Perhitungan Konduksi Panas (Q)*\n\n` + `*Konduktivitas (k):* ${k} W/m·K\n` + `*Luas (A):* ${A} m²\n` + `*Perubahan Suhu (ΔT):* ${deltaT} K\n` + `*Tebal (Δx):* ${deltaX} m\n` + `*Laju Perpindahan Panas (Q):* ${heatTransfer.toFixed(2)} W (Watt)`, message);
    }
    break;
    
    default: { lenwyreply(mess.default, message) }
    }
}