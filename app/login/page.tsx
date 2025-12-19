
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid credentials');
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative font-mono text-sm tracking-wider">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b-2 border-dashed border-gray-300">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#FFD700] flex items-center justify-center border-2 border-black font-bold">
            A
          </div>
          <span className="font-bold text-lg">CMS // ACCESS</span>
        </div>
        <Link href="/" className="hover:underline flex items-center gap-2 font-bold text-xs uppercase">
          ← Return to Portfolio
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* Shadow Box */}
          <div className="absolute top-2 left-2 w-full h-full bg-black border-2 border-black"></div>
          
          {/* Main Card */}
          <div className="relative w-[480px] bg-white border-2 border-black p-12 flex flex-col items-center shadow-none z-10">
            {/* System Locked Tag */}
            <div className="absolute -top-4 -left-4 bg-[#FFD700] border-2 border-black px-4 py-1 transform -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-bold text-xs">SYSTEM_LOCKED</span>
            </div>

            <h1 className="text-4xl font-black mb-2 tracking-widest uppercase">Identify</h1>
            <p className="text-gray-500 mb-12 text-[10px] uppercase tracking-[0.2em]">Please enter your credentials.</p>

            <form onSubmit={handleSubmit} className="w-full space-y-8">
              <div className="space-y-2">
                <label className="block font-bold text-xs uppercase text-gray-600">Username / Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-800 focus:outline-none focus:ring-0 focus:border-black font-semibold placeholder-gray-300"
                    placeholder="dev@angga.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-xs uppercase text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-gray-800 focus:outline-none focus:ring-0 focus:border-black font-semibold text-lg tracking-widest placeholder-gray-300"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-red-600 text-xs font-bold text-center uppercase">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 uppercase tracking-widest hover:bg-gray-900 transition-colors flex justify-center items-center gap-2 group"
              >
                {loading ? 'Accessing...' : 'Login Access'}
                {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
              </button>
            </form>

            <div className="mt-8 border-t border-dashed border-gray-300 w-full pt-6 text-center space-y-2">
                <a href="#" className="text-[10px] text-gray-400 font-bold uppercase hover:text-black">Forgot Password?</a>
                <p className="text-[9px] text-gray-300 uppercase tracking-widest">Unauthorized access is prohibited</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="bg-[#FFD700] py-3 border-t-2 border-black overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block font-bold text-xs uppercase tracking-widest">
            <span className="mx-4">Online • Database: Connected • Secure Connection Established • v2.0.4 Build 2023 • System Status: Online • Database: Connected • Secure Connection Established • v2.0.4 Build 2023 • System Status: Online</span>
        </div>
      </footer>
    </div>
  );
}
