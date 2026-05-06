export const BOARD_SIZE = 36; // 6x6
export const GRID_DIM = 6;

export const LADDERS = {
  4: 14,
  9: 20,
  17: 27,
  22: 32
};

export const SNAKES = {
  15: 5,
  24: 12,
  31: 21,
  34: 19
};

export const CHALLENGES = [
  { id: 1, text: "Ucapkan satu kata manis untuk pasanganmu.", type: "sweet" },
  { id: 2, text: "Berikan pujian tentang penampilannya hari ini.", type: "sweet" },
  { id: 3, text: "Pegang tangan pasanganmu selama 1 menit.", type: "touch" },
  { id: 4, text: "Sebutkan satu hal yang membuatmu jatuh cinta padanya.", type: "romantic" },
  { id: 5, text: "Berikan pelukan hangat selama 10 detik.", type: "touch" },
  { id: 6, text: "Ceritakan momen kencan terfavoritmu bersamanya.", type: "romantic" },
  { id: 7, text: "Bisikkan kata 'Aku sayang kamu' dengan lembut.", type: "sweet" },
  { id: 8, text: "Tatapan mata selama 15 detik tanpa tertawa.", type: "fun" },
  { id: 9, text: "Pijat bahu pasanganmu sebentar (1 menit).", type: "touch" },
  { id: 10, text: "Sebutkan 3 hal yang kamu syukuri dari pasanganmu.", type: "sweet" },
  { id: 11, text: "Berikan ciuman di kening.", type: "touch" },
  { id: 12, text: "Gombalin pasanganmu sampai dia tersenyum.", type: "fun" }
];

// Special tiles that trigger challenges (randomized placement)
export const CHALLENGE_TILES = [2, 7, 13, 18, 23, 29, 33];
