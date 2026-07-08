import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — BoothKita',
  description: 'Syarat dan Ketentuan Penggunaan BoothKita.',
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Syarat & Ketentuan</h1>
        <p style={{ color: 'var(--text-muted, #8b8b9a)', fontSize: 14, marginBottom: 48 }}>Terakhir diperbarui: 1 Juli 2026</p>

        <Section title="1. Penerimaan Ketentuan">
          <p>Dengan mengakses atau menggunakan layanan BoothKita, kamu menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika kamu tidak menyetujui, harap hentikan penggunaan layanan ini.</p>
        </Section>

        <Section title="2. Deskripsi Layanan">
          <p><strong>BoothKita</strong> adalah platform photobooth online yang memungkinkan dua orang untuk berfoto bersama secara real-time melalui internet. Layanan ini bersifat gratis dan tidak memerlukan pembuatan akun.</p>
        </Section>

        <Section title="3. Penggunaan yang Diperbolehkan">
          <p>Kamu setuju untuk menggunakan BoothKita hanya untuk tujuan yang sah dan sesuai ketentuan berikut:</p>
          <ul>
            <li>Penggunaan pribadi, hiburan, dan non-komersial.</li>
            <li>Tidak menggunakan layanan ini untuk membuat, berbagi, atau menyimpan konten yang bersifat ilegal, kasar, pornografi, atau melanggar hak orang lain.</li>
            <li>Tidak mencoba meretas, merusak, atau mengganggu infrastruktur layanan.</li>
            <li>Tidak menggunakan bot atau alat otomatis untuk membuat room dalam jumlah besar.</li>
          </ul>
        </Section>

        <Section title="4. Konten & Hak Cipta">
          <p>Semua foto yang kamu hasilkan menggunakan BoothKita adalah milik kamu sepenuhnya. Kami tidak mengklaim kepemilikan atas konten yang kamu buat.</p>
          <p>Desain, kode, dan aset BoothKita dilindungi oleh hak cipta © {new Date().getFullYear()} BoothKita. Dilarang menyalin, mendistribusikan, atau memodifikasi tanpa izin tertulis dari kami.</p>
        </Section>

        <Section title="5. Batasan Tanggung Jawab">
          <p>BoothKita disediakan "<em>sebagaimana adanya</em>" (<em>as-is</em>) tanpa jaminan apapun. Kami tidak bertanggung jawab atas:</p>
          <ul>
            <li>Gangguan layanan atau downtime sementara.</li>
            <li>Kehilangan data sesi akibat koneksi internet yang tidak stabil.</li>
            <li>Konten yang dibuat atau dibagikan oleh pengguna.</li>
            <li>Kerugian tidak langsung akibat penggunaan layanan ini.</li>
          </ul>
        </Section>

        <Section title="6. Privasi">
          <p>Penggunaan data kamu diatur oleh <Link href="/privacy" style={{ color: '#ff7e5f', textDecoration: 'none', fontWeight: 600 }}>Kebijakan Privasi</Link> kami, yang merupakan bagian tak terpisahkan dari Syarat & Ketentuan ini.</p>
        </Section>

        <Section title="7. Perubahan Layanan">
          <p>Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan sewaktu-waktu tanpa pemberitahuan sebelumnya. Kami tidak bertanggung jawab atas gangguan yang timbul akibat perubahan tersebut.</p>
        </Section>

        <Section title="8. Hukum yang Berlaku">
          <p>Syarat & Ketentuan ini diatur oleh hukum yang berlaku di Republik Indonesia. Segala sengketa akan diselesaikan melalui musyawarah mufakat.</p>
        </Section>

        <Section title="9. Hubungi Kami">
          <p>Pertanyaan mengenai Syarat & Ketentuan ini dapat disampaikan ke:</p>
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
