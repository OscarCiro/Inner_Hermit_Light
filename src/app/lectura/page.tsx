import ReadingPageClient from './ReadingPageClient';

export default function ReadingPage() {
  return <ReadingPageClient />;
}

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering for searchParams
