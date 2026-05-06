export const BOARD_SIZE = 36; // 6x6
export const GRID_DIM = 6;

// Predefined layouts for different rounds
export const BOARD_LAYOUTS = [
  // Round 1 (Level 1)
  {
    ladders: { 4: 14, 9: 20, 17: 27, 22: 32 },
    snakes: { 15: 5, 24: 12, 31: 21, 34: 19 },
    challengeTiles: [2, 5, 8, 11, 13, 16, 18, 21, 23, 26, 29, 33]
  },
  // Round 2 (Level 2)
  {
    ladders: { 3: 13, 10: 21, 16: 26, 25: 35 },
    snakes: { 14: 4, 19: 9, 28: 18, 32: 22 },
    challengeTiles: [4, 7, 12, 15, 20, 23, 24, 27, 30, 31, 34]
  },
  // Round 3 (Level 3)
  {
    ladders: { 2: 12, 8: 18, 15: 25, 21: 31 },
    snakes: { 13: 3, 20: 10, 27: 17, 33: 23 },
    challengeTiles: [3, 6, 9, 14, 17, 19, 22, 26, 28, 30, 32]
  }
];

export const CHALLENGES = [
  // Part 1
  { id: 1, text: "Peluk pasangan kamu erat selama 20 detik 🤭" },
  { id: 2, text: "Cium pipi pasangan kamu 3x (kiri, kanan, tengah 😚)" },
  { id: 3, text: "Tatap mata pasangan kamu dari dekat selama 15 detik 😳" },
  { id: 4, text: "Pegang tangan pasangan kamu sambil saling mendekat selama 15 detik" },
  { id: 5, text: "Peluk pasangan kamu dari belakang selama 15 detik" },
  { id: 6, text: "Sandarkan kepala kamu di bahu pasangan selama 15 detik" },
  { id: 7, text: "Cium tangan pasangan kamu lalu lihat matanya" },
  { id: 8, text: "Pegang wajah pasangan kamu dengan lembut selama 10 detik" },
  { id: 9, text: "Deketin wajah kamu ke pasangan sampai hampir sentuh (tahan 5 detik 😳)" },
  { id: 10, text: "Peluk pasangan kamu sambil bilang sesuatu yang manis" },
  { id: 11, text: "Duduk sangat dekat dengan pasangan selama 15 detik tanpa ngomong" },
  { id: 12, text: "Sentuh tangan pasangan kamu dan mainkan jari-jarinya selama 10 detik" },
  { id: 13, text: "Tarik pasangan kamu mendekat secara pelan 🤍" },
  { id: 14, text: "Pegang tangan pasangan sambil tatap matanya dan senyum" },
  { id: 15, text: "Cium kening pasangan kamu dengan lembut" },
  { id: 16, text: "Peluk pasangan kamu sambil usap punggungnya pelan" },
  { id: 17, text: "Dekatkan wajah kamu lalu senyum tanpa ngomong selama 10 detik" },
  { id: 18, text: "Tempelkan dahi kamu ke pasangan selama 10 detik" },
  { id: 19, text: "Pegang tangan pasangan lalu tarik dia sedikit mendekat" },
  { id: 20, text: "Peluk pasangan kamu sebelum lanjut giliran berikutnya" },
  // Part 2
  { id: 21, text: "Peluk pasangan kamu erat sambil menutup mata selama 20 detik 🤍" },
  { id: 22, text: "Cium pipi pasangan kamu lalu peluk sebentar 😚" },
  { id: 23, text: "Tempelkan dahi kamu ke pasangan sambil saling lihat mata 10 detik 😳" },
  { id: 24, text: "Pegang kedua tangan pasangan kamu dan tarik dia mendekat pelan" },
  { id: 25, text: "Duduk berdempetan tanpa jarak selama 15 detik" },
  { id: 26, text: "Peluk pasangan kamu sambil senyum ke arahnya" },
  { id: 27, text: "Pegang wajah pasangan kamu lalu lihat matanya tanpa ngomong" },
  { id: 28, text: "Cium kening pasangan kamu lalu peluk ringan" },
  { id: 29, text: "Sandarkan kepala kalian berdua saling bersentuhan" },
  { id: 30, text: "Pegang tangan pasangan kamu dan gosok pelan" },
  { id: 31, text: "Dekatkan wajah kamu ke pasangan sampai hampir bersentuhan (tahan 7 detik 😳)" },
  { id: 32, text: "Peluk pasangan kamu dari samping sambil nempel" },
  { id: 33, text: "Pegang tangan pasangan lalu saling menatap 10 detik" },
  { id: 34, text: "Sentuhkan hidung kalian pelan (eskimo kiss 😆)" },
  { id: 35, text: "Peluk pasangan kamu lalu tepuk punggungnya pelan" },
  { id: 36, text: "Duduk sangat dekat sampai bahu bersentuhan selama 15 detik" },
  { id: 37, text: "Pegang tangan pasangan lalu tarik dia sedikit lebih dekat" },
  { id: 38, text: "Cium tangan pasangan kamu lalu senyum ke dia" },
  { id: 39, text: "Tempelkan kepala kamu ke pasangan tanpa ngomong" },
  { id: 40, text: "Peluk pasangan kamu sambil bilang sesuatu pelan ke telinganya" }
];
