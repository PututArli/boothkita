import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — BoothKita',
  description: 'Kebijakan Privasi BoothKita. Pelajari bagaimana kami menangani data kamu.',
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-body, sans-serif)', padding: '0 0 80px' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, background: 'rgba(13,13,18,0.9)', zIndex: 10 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Kembali</span>
        </Link>
        <span style={{ fontSize: 15, fontWeight: 700, background: 'linear-gradient(to right, #ff7e5f, #feb47b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BoothKita</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Kebijakan Privasi</h1>
        <p style={{ color: 'var(--text-muted, #8b8b9a)', fontSize: 14, marginBottom: 48 }}>Terakhir diperbarui: 1 Juli 2026</p>

        <Section title="1. Pendahuluan">
          <p>Selamat datang di <strong>BoothKita</strong>. Kami sangat menghargai privasi kamu dan berkomitmen untuk melindunginya. Kebijakan ini menjelaskan informasi apa yang kami kumpulkan (atau tidak kami kumpulkan) saat kamu menggunakan layanan BoothKita.</p>
        </Section>

        <Section title="2. Data yang TIDAK Kami Kumpulkan">
          <p>BoothKita dirancang dengan prinsip <strong>privasi sejak awal (privacy-by-design)</strong>. Kami secara tegas <strong>TIDAK</strong> mengumpulkan atau menyimpan:</p>
          <ul>
            <li><strong>Data Biometrik:</strong> Wajah, sidik jari, iris mata, atau data biometrik apapun <em>tidak pernah</em> dianalisis, disimpan, atau dikirim ke server kami.</li>
            <li><strong>Foto & Video Kamu:</strong> Semua aliran video kamera dan foto yang diambil selama sesi dikirim langsung antara dua perangkat (peer-to-peer melalui WebRTC). Data ini <em>tidak pernah melewati</em> atau tersimpan di server kami.</li>
            <li><strong>Data Pribadi:</strong> Kami tidak meminta, menyimpan, atau memproses nama, email, nomor telepon, atau identitas apapun. Kamu tidak perlu mendaftar akun.</li>
            <li><strong>Rekaman Sesi:</strong> Kami tidak merekam percakapan atau aktivitas kamu selama sesi.</li>
          </ul>
        </Section>

        <Section title="3. Data yang Kami Simpan Sementara">
          <p>Untuk menjalankan layanan, kami menyimpan data minimal berikut di database kami (<strong>Supabase</strong>):</p>
          <ul>
            <li><strong>Kode Room:</strong> Sebuah kode unik acak (6 karakter) yang dibuat saat kamu membuat sesi. Kode ini <em>tidak terhubung ke identitas apapun</em>.</li>
            <li><strong>Waktu Kedaluwarsa:</strong> Stempel waktu kapan room tersebut dianggap tidak aktif.</li>
          </ul>
          <p>Data ini <strong>dihapus otomatis</strong> setelah sesi berakhir atau setelah beberapa menit tidak ada aktivitas. Kami tidak pernah menjual atau berbagi data ini kepada pihak ketiga.</p>
        </Section>

        <Section title="4. Izin Kamera & Mikrofon">
          <p>BoothKita memerlukan izin akses kamera dan mikrofon dari browser kamu untuk menjalankan fungsi foto bersama. Izin ini:</p>
          <ul>
            <li>Hanya aktif selama kamu berada di halaman sesi foto.</li>
            <li>Dikelola sepenuhnya oleh browser kamu (Chrome, Safari, Firefox, dll).</li>
            <li>Dapat dicabut kapan saja melalui pengaturan browser kamu.</li>
            <li>Tidak pernah digunakan untuk pengenalan wajah atau analisis biometrik apapun.</li>
          </ul>
        </Section>

        <Section title="5. Layanan Pihak Ketiga">
          <p>BoothKita menggunakan layanan pihak ketiga berikut untuk beroperasi:</p>
          <ul>
            <li><strong>Supabase</strong> (Database & Realtime): Menyimpan data room sementara. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#ff7e5f' }}>Kebijakan Privasi Supabase →</a></li>
            <li><strong>Vercel</strong> (Hosting): Menghosting aplikasi web ini. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#ff7e5f' }}>Kebijakan Privasi Vercel →</a></li>
          </ul>
        </Section>

        <Section title="6. Keamanan">
          <p>Komunikasi video antara dua pengguna dienkripsi dari ujung ke ujung menggunakan protokol standar industri <strong>WebRTC (DTLS/SRTP)</strong>. Tidak ada perantara yang dapat mengakses konten aliran video atau audio kamu.</p>
        </Section>

        <Section title="7. Perubahan Kebijakan">
          <p>Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan akan tercermin pada tanggal "Terakhir diperbarui" di bagian atas halaman ini.</p>
        </Section>

        <Section title="8. Hubungi Kami">
          <p>Jika kamu memiliki pertanyaan mengenai kebijakan privasi ini, hubungi kami melalui:</p>
          <p><a href="mailto:rafaelpututarli@gmail.com" style={{ color: '#ff7e5f', textDecoration: 'none', fontWeight: 600 }}>rafaelpututarli@gmail.com</a></p>
        </Section>
      </div>

      <footer style={{ borderTop: '1px solid var(--border, rgba(255,255,255,0.08))', padding: '24px', textAlign: 'center', color: 'var(--text-muted, #8b8b9a)', fontSize: 13 }}>
        © {new Date().getFullYear()} BoothKita. All rights reserved.
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
        {children}
      </div>
    </section>
  );
}
