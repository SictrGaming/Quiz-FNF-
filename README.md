# Quiz Web — JS + JSON

Quiz website statis menggunakan HTML, CSS, JavaScript, dan JSON.

## Fitur
- Sistem poin per soal seperti Google Forms
- Setiap soal dapat memiliki `points`
- Skor akhir dihitung dari total poin yang diperoleh
- Pilihan jawapan berupa button/card tanpa radio bulat
- Pilihan jawapan berada di tengah
- Sokongan audio MP3
- Data quiz dikawal manual melalui `data/quizzes.json`
- Tiada PHP
- Tiada database
- Tiada tombol Admin pada halaman utama
- Sesuai untuk Cloudflare Pages dan GitHub Pages

## Format JSON

Setiap soal mempunyai `points`:

```json
{
  "id": "q1",
  "question": "Berapakah 2 + 2?",
  "points": 5,
  "audio": null,
  "options": {
    "A": "3",
    "B": "4",
    "C": "5",
    "D": "6"
  },
  "answer": "B"
}
```

Contoh:
- Soal 1 = 5 poin
- Soal 2 = 10 poin
- Soal 3 = 2 poin

Jika semua benar, maksimum = 17 poin.

## Menjalankan

Boleh terus buka `index.html` atau gunakan VS Code Live Server.

Untuk Cloudflare Pages:
- Framework preset: None
- Build command: kosong
- Output directory: `/`

## Audio

Letakkan MP3 dalam folder `audio/` dan isi nama fail pada `audio`, contoh:

`"audio": "soal-01.mp3"`

## Catatan

Data quiz sengaja dibuat manual melalui JSON. Admin editor dari versi sebelumnya tidak digunakan pada versi ini.
