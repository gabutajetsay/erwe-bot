// src/event/event.message.js

// Import handler dari lenwy.js
// Pastikan lenwy.js menggunakan `export default`
import lenwyHandler from '../lenwy.js';

export default async (client, message) => { // Menerima client dan message dari index.js
    // Adaptasi objek pesan dari whatsapp-web.js ke format Baileys
    const m = {
        messages: [{
            message: {
                conversation: message.body,
                extendedTextMessage: { text: message.body }
            },
            key: {
                remoteJid: message.from,
                id: message.id._serialized, // ID pesan
                fromMe: message.fromMe, // Cek apakah pesan dari bot sendiri
            },
            // Dapatkan nama pengirim dari client
            pushName: (await client.getContactById(message.from)).pushname || "Pengguna",
        }]
    };

    // Panggil handler lenwy.js dengan objek pesan yang sudah diadaptasi
    // `client` dari whatsapp-web.js akan bertindak sebagai `lenwy` di lenwy.js
    await lenwyHandler(client, m);
};