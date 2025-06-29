/*
  Made By Lenwy
  Base : Lenwy
  WhatsApp : wa.me/6283829814737
  Telegram : t.me/ilenwy
  Youtube : @Lenwy

  Channel : https://whatsapp.com/channel/0029VaGdzBSGZNCmoTgN2K0u

  Copy Code?, Recode?, Rename?, Reupload?, Reseller? Taruh Credit Ya :D

  Deskripsi: Fungsi Untuk Mengambil Respons AI menggunakan Gemini API
  Mohon Untuk Tidak Menghapus Watermark Di Dalam Kode Ini
*/

const { GoogleGenerativeAI } = require("@google/generative-ai");

// GANTI 'YOUR_API_KEY' DENGAN KUNCI API ANDA!
// Kunci API Anda adalah: AIzaSyDmMVJ3BSqlLO2eqrmTc_l-SYsUmcEL4YY
const genAI = new GoogleGenerativeAI("AIzaSyBDCk6174FLMcldrPcG6VaQVUlByUGDkT0");

async function Ai4Chat(prompt) {
    try {
       // Ganti model dari "gemini-pro" ke yang lebih baru
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        // Kirim prompt ke model
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error fetching Gemini AI response:", error);
        // Anda bisa mengembalikan pesan error yang lebih ramah pengguna di sini
        throw new Error("Maaf, terjadi kesalahan saat menghubungi AI.");
    }
}

module.exports = Ai4Chat;