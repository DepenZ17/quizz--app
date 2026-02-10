# React Quiz App - OpenTDB Integration

Aplikasi Kuis interaktif yang dibangun menggunakan React.js dengan integrasi API dari Open Trivia Database. Aplikasi ini dilengkapi dengan sistem timer, login sederhana, dan mekanisme resume menggunakan LocalStorage.

## 🚀 Fitur Utama
- **Login Sederhana**: Masuk dengan nama pengguna untuk memulai kuis.
- **Integrasi API**: Soal diambil secara dinamis dari [OpenTDB](https://opentdb.com/).
- **Mekanisme Resume**: Jika browser ditutup atau di-refresh, progres soal dan sisa waktu tetap tersimpan.
- **Satu Soal Per Halaman**: Navigasi otomatis ke soal berikutnya setelah memilih jawaban.
- **Timer Otomatis**: Kuis akan otomatis berhenti jika waktu habis.
- **Hasil Skor**: Menampilkan jumlah benar, salah, dan total soal yang dikerjakan.

## 🛠️ Teknologi yang Digunakan
- **React.js**: Library utama untuk UI.
- **LocalStorage API**: Untuk penyimpanan data progres kuis (Persistence).
- **CSS3**: Untuk styling antarmuka pengguna (Responsive Design).
- **OpenTDB API**: Sebagai sumber data soal kuis.

## ⚙️ Cara Menjalankan Secara Lokal

1. Clone repositori ini:
   git clone https://github.com/USERNAME_ANDA/NAMA_REPO.git
   
3. Masuk ke folder proyek:
   cd NAMA_FOLDER_PROYEK
   
5. Install dependencies:
   npm install
   
7. Jalankan aplikasi:
   npm start
   
9. Buka http://localhost:3000 di browser Anda.
