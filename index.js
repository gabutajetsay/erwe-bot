/*  

  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini

*/

// Import Module
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const http = require('http'); // Tambahkan import http
const qrcode = require('qrcode'); // Tambahkan import qrcode
const fs = require('fs');

// Global variable untuk menyimpan URL QR Code
let qrCodeUrl = null;

async function connectToWhatsApp() {
    // Tambahkan variabel untuk menyimpan sesi
    const { state, saveCreds } = await useMultiFileAuthState('./session');

    // Buat instance bot Baileys
    const lenwy = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // Matikan pencetakan QR di terminal
        auth: state,
        browser: ['Lenwy', 'Chrome', '4.0.0']
    });

    // Simpan sesi saat ada perubahan
    lenwy.ev.on('creds.update', saveCreds);

    // Tangani event koneksi
    lenwy.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Tangkap QR Code dan ubah menjadi URL
        if (qr) {
            qrcode.toDataURL(qr, (err, url) => {
                if (err) {
                    console.error('Gagal membuat URL QR Code:', err);
                    return;
                }
                qrCodeUrl = url;
                console.log('URL QR Code sudah siap. Kunjungi URL Render Anda untuk scan.');
            });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi terputus, mencoba menyambung ulang:', lastDisconnect.error, shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                await connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Bot berhasil terhubung!');
            // Hapus QR Code setelah terhubung
            qrCodeUrl = null;
        }
    });

    // Event untuk menerima pesan
    lenwy.ev.on('messages.upsert', (m) => {
        require('./lenwy')(lenwy, m);
    });
}

// Tambahkan server web untuk menampilkan QR Code
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html'); // Set Content-Type menjadi HTML

    if (qrCodeUrl) {
        // Tampilkan halaman dengan QR Code jika tersedia
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Scan QR Code</title>
                <style>
                    body { font-family: sans-serif; text-align: center; background-color: #1c1c1c; color: #fff; padding-top: 50px; }
                    img { max-width: 300px; border: 5px solid #00a884; border-radius: 10px; }
                    h1 { color: #00a884; }
                </style>
            </head>
            <body>
                <h1>Scan QR Code untuk Menghubungkan Bot</h1>
                <p>Pindai kode di bawah ini menggunakan WhatsApp di ponsel Anda. QR Code akan hilang setelah terhubung.</p>
                <img src="${qrCodeUrl}" alt="WhatsApp QR Code">
            </body>
            </html>
        `);
    } else {
        // Tampilkan pesan status jika QR Code belum tersedia
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bot Status</title>
                <style>
                    body { font-family: sans-serif; text-align: center; background-color: #1c1c1c; color: #fff; padding-top: 50px; }
                    h1 { color: #fff; }
                </style>
            </head>
            <body>
                <h1>Bot Sedang Berjalan...</h1>
                <p>Menunggu QR Code muncul atau sedang terhubung. Coba refresh halaman ini dalam beberapa detik.</p>
            </body>
            </html>
        `);
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    // Mulai koneksi bot setelah server listening
    connectToWhatsApp();
});