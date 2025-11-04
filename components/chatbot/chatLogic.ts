const responses: { [key: string]: string } = {
  'default': "Maaf, saya belum mengerti pertanyaan itu. Anda bisa menghubungi tim support kami di info@alfamidi.co.id.",
  'halo': "Halo juga! Ada yang bisa saya bantu terkait pengajuan properti Anda di MidiLand?",
  'bantu': "Tentu! Apa yang ingin Anda ketahui? (Contoh: 'cara pengajuan', 'status review', 'kriteria properti')",
  'cara': "Anda bisa mendaftarkan properti baru dengan klik menu 'Pengajuan Properti' di bagian atas, lalu isi formulir dengan lengkap.",
  'review': "Status 'Sedang Direview' berarti tim kami sedang melakukan peninjauan awal terhadap data dan kelengkapan dokumen Anda.",
  'survey': "Status 'Survey' berarti properti Anda lolos seleksi awal. Tim kami akan segera menjadwalkan kunjungan ke lokasi.",
  'tolak': "Pengajuan bisa 'Ditolak' karena beberapa faktor, seperti lokasi, ukuran, atau legalitas. Silakan klik 'Lihat Detail' di kartu properti untuk info lebih lanjut.",
  'berapa lama': "Proses review awal biasanya memakan waktu 7-14 hari kerja. Jika lolos ke tahap 'Survey', tim kami akan menghubungi Anda.",
  'kriteria': "Kami mencari lokasi strategis dengan luas minimum, akses jalan, dan potensi pasar yang baik. Semua pengajuan akan dinilai oleh tim survei kami.",
  'admin': "Tentu. Untuk bantuan lebih lanjut, Anda dapat menghubungi tim support kami melalui email di info@alfamidi.co.id pada jam operasional.",
  'terima kasih': "Sama-sama! Senang bisa membantu."
};

/**
 * Fungsi ini menerima teks dari pengguna dan mengembalikan respons dari bot.
 * @param userMessage
 * @returns
 */
export const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  if (message.includes('halo') || message.includes('hai')) return responses['halo'];
  if (message.includes('bantu') || message.includes('help')) return responses['bantu'];
  if (message.includes('cara') || message.includes('gimana') || message.includes('bagaimana')) return responses['cara'];
  if (message.includes('review')) return responses['review'];
  if (message.includes('survey')) return responses['survey'];
  if (message.includes('tolak')) return responses['tolak'];
  if (message.includes('berapa lama') || message.includes('waktu')) return responses['berapa lama'];
  if (message.includes('kriteria')) return responses['kriteria'];
  if (message.includes('admin') || message.includes('manusia') || message.includes('kontak')) return responses['admin'];
  if (message.includes('makasih') || message.includes('terima kasih')) return responses['terima kasih'];
  return responses['default'];
};

