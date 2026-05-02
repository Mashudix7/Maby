import MainLayout from '../components/layout/MainLayout';

const BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHXpENKkw3QZrteUjfVRRxMAYxUafSYJ7-6kOzTT2VkbVFv6wkvlVW_zcIWjYpWI7MoXfUbsQR4NVMCjCdRqh_drr6J7IPNO1QNY0CWOFYBxXPdy_EZDHqFTih4I5fxQk29i9Sb5iH_QYrGPV2n1-esG-5liqpKexV82VmEclQAnAQnypm_CD7X7z0hJ4wohac7OBZbjKfVGKdKiBPKtfi7t634oY42P7gYs0HGwwUXSrFiZaCPKT4A1aQ0cb4qpquE1DckjPBdA';

const milestones = [
  { date: 'Januari 2020', title: 'Pertama Bertemu', description: 'Tatapan pertama yang mengubah segalanya. Kita bertemu di kedai kopi kecil di sudut jalan.', icon: 'favorite', color: 'bg-primary-container text-primary' },
  { date: 'Maret 2020', title: 'Kencan Pertama', description: 'Makan malam sederhana yang berakhir dengan jalan-jalan panjang di bawah bintang-bintang.', icon: 'restaurant', color: 'bg-secondary-container text-secondary' },
  { date: 'Juni 2020', title: 'Resmi Jadian', description: 'Hari dimana kita memutuskan untuk menjalani semuanya bersama. Nggak ada yang lebih membahagiakan.', icon: 'celebration', color: 'bg-primary-container text-primary' },
  { date: 'Desember 2020', title: 'Liburan Pertama Bersama', description: 'Perjalanan ke pegunungan yang dingin tapi hati kita hangat. Momen yang nggak akan pernah terlupakan.', icon: 'flight', color: 'bg-tertiary-container text-tertiary' },
  { date: 'Februari 2021', title: 'Anniversary Pertama', description: 'Setahun penuh cinta, tawa, dan air mata bahagia. Ini baru permulaan.', icon: 'cake', color: 'bg-primary-container text-primary' },
  { date: 'Agustus 2021', title: 'Pindah Bareng', description: 'Apartemen kecil kita. Tempat dimana setiap sudut menyimpan kenangan manis.', icon: 'home', color: 'bg-secondary-container text-secondary' },
  { date: 'Oktober 2023', title: 'Hari Ini', description: 'Setiap hari bersamamu adalah petualangan baru. Nggak sabar buat lanjut nulis cerita ini.', icon: 'auto_awesome', color: 'bg-primary-container text-primary' },
];

export default function RelationshipJourney() {
  return (
    <MainLayout activePage="/">
      {/* Ambient BG */}
      <div className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-multiply" style={{ backgroundImage: `url('${BG}')` }} />

      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">favorite</span>
            Cerita Kita
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-primary dark:text-rose-300 italic mb-4">Perjalanan Kita</h1>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
            Dari pandangan pertama hingga hari ini, setiap langkah bersama adalah keajaiban 💕
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary-container via-secondary-container to-primary-container md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((ms, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${ms.color} flex items-center justify-center shadow-lg border-4 border-white z-10`}>
                    <span className="material-symbols-outlined text-[20px]">{ms.icon}</span>
                  </div>

                  {/* Card */}
                  <div className={`ml-20 md:ml-0 md:w-[calc(50%-40px)] glass-panel rounded-2xl p-6 md:p-8 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <time className="text-xs font-semibold text-outline block mb-2">{ms.date}</time>
                    <h3 className="font-serif text-xl md:text-2xl text-primary italic mb-3">{ms.title}</h3>
                    <p className="text-base text-on-surface-variant leading-relaxed">{ms.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="font-serif text-2xl text-primary italic mb-4">...dan cerita ini belum selesai 💗</p>
          <p className="text-base text-on-surface-variant">Setiap hari bersama kamu adalah halaman baru yang indah.</p>
        </div>
      </div>
    </MainLayout>
  );
}
