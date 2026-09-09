# Quiz Web — JS + JSON

Website quiz murni HTML, CSS, JavaScript, dan JSON.

## Fitur
- Daftar quiz dari JSON
- Pilihan ganda A–D
- Skor otomatis
- Soal dapat memiliki file MP3
- Admin editor untuk membuat/mengedit data quiz
- Export JSON dari admin
- Import JSON
- Tidak memakai PHP
- Tidak memakai database
- Bisa dijalankan sebagai static site
- Cocok untuk GitHub Pages dan Cloudflare Pages

## Menjalankan

Tidak membutuhkan Node.js.

Cara paling mudah:
1. Buka `index.html` langsung di browser, atau
2. Gunakan static server seperti VS Code Live Server.

Untuk Cloudflare Pages:
- Upload repository ini ke GitHub.
- Buat Cloudflare Pages project.
- Framework preset: None.
- Build command: kosong.
- Output directory: `/`.

## Catatan data

Browser tidak dapat menulis perubahan langsung ke file `data/quizzes.json` yang berada di GitHub/Cloudflare.

Admin menyediakan:
- editor quiz
- import JSON
- export JSON

Setelah membuat/mengubah quiz, klik Export JSON lalu ganti file `data/quizzes.json` dengan hasil export dan commit ke repository.

## Audio

Letakkan MP3 di folder `audio/`, kemudian isi field audio pada JSON dengan nama file, contoh:

`audio: "contoh.mp3"`

Untuk repository publik, perhatikan ukuran file MP3 dan lisensi audio yang digunakan.
