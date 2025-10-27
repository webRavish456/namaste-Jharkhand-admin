'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.push('/dashboard');
  }, [router]);

  return null; // This component doesn't render anything as it redirects immediately
}