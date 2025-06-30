// index.js - Kode lengkap untuk bot whatsapp-web.js

// 1. Import semua modul yang dibutuhkan.
// Gunakan sintaks 'import pkg from ...' untuk CommonJS
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = pkg;
import http from 'http';
import qrcode from 'qrcode';
import pino from 'pino';

// 2. Import handler pesan dari file lokal.
// CATATAN PENTING: File './src/event/event.message.js' HARUS menggunakan `export default`.
import messageHandler from './src/event/event.message.js';

// 3. Variabel global untuk menyimpan URL QR code.
let qrCodeUrl = null;

// 4. Buat Klien WhatsApp.
const client = new Client({
    // Simpan sesi di folder 'sessions'.
    authStrategy: new LocalAuth({ clientId: 'bot-erwe' }),
    // Argumen Puppeteer untuk server.
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Direkomendasikan untuk Render
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Gunakan jika memori terbatas
            '--disable-gpu' ,
			'--lang=en-US',
        ],
    },
});

// 5. Tangani Event Klien.
client.on('qr', (qr) => {
    console.log('QR Code siap, silakan pindai!');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Gagal membuat URL QR Code:', err);
            return;
        }
        qrCodeUrl = url;
    });
});

client.on('ready', () => {
    console.log('Bot berhasil terhubung dan siap digunakan!');
    qrCodeUrl = null; // Hapus URL QR code setelah terhubung.
});

client.on('message', async (message) => {
    // 6. Panggil handler pesan eksternal.
    // Kode di 'event.message.js' akan memproses pesan.
    await messageHandler(client, message);
});

client.on('disconnected', (reason) => {
    console.log('Klien terputus:', reason);
    // client.initialize(); // Anda bisa tambahkan ini untuk sambung ulang otomatis
});

// 7. Buat Server HTTP untuk Menampilkan QR Code.
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    if (qrCodeUrl) {
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
                <p>Pindai kode di bawah ini menggunakan WhatsApp di ponsel Anda.</p>
                <img src="${qrCodeUrl}" alt="WhatsApp QR Code">
                <p>Halaman ini akan diperbarui setelah bot terhubung.</p>
            </body>
            </html>
        `);
    } else {
        res.end('Bot sudah terhubung dan berjalan!');
    }
});

// 8. Mulai server dan klien bot.
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    client.initialize();
});