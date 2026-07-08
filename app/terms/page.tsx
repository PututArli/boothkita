import type { Metadata } from 'next';
import TermsContent from './content';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — BoothKita',
  description: 'Syarat dan Ketentuan Penggunaan BoothKita.',
};

export default function TermsPage() {
  return <TermsContent />;
}
