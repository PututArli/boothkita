import type { Metadata } from 'next';
import PrivacyContent from './content';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — BoothKita',
  description: 'Kebijakan Privasi BoothKita. Pelajari bagaimana kami menangani data kamu.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
