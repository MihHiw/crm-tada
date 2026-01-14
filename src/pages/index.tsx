import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.pathname === '/') {
      const token = localStorage.getItem('token');
      console.log('🏠 [Landing Page] Pathname:', router.pathname, '| Token:', token ? 'EXISTS' : 'NONE');

      if (token) {
        console.log('🏠 [Landing Page] Redirecting to /app');
        router.replace('/app');
      } else {
        console.log('🏠 [Landing Page] Redirecting to /register');
        router.replace('/register');
      }
    }
  }, [router.isReady, router.pathname, router]);

  return (
    <>
      <Head>
        <title>Vanilla Beauty & Wellness</title>
        <meta name="description" content="Hệ thống đặt lịch làm đẹp" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
            Vanilla Beauty & Wellness
          </h1>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </main>
    </>
  );
}
