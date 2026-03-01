'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [pesan, setPesan] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Halo! Saya MedBot, asisten AI Anda yang siap berbagi informasi kesehatan umum. Ada yang bisa saya bantu hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Fitur 4: Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const kirimPesan = async () => {
    if (!pesan.trim()) return;

    // Tambahkan pesan user ke layar
    const pesanBaru = { role: 'user', text: pesan };
    setChatHistory((prev) => [...prev, pesanBaru]);
    setPesan('');
    setIsLoading(true);

    try {
      // Pastikan port backend Anda benar (8000)
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan: pesanBaru.text }),
      });
      
      const data = await response.json();
      
      // Tambahkan balasan AI ke layar
      setChatHistory((prev) => [...prev, { role: 'ai', text: data.jawaban }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'ai', text: 'Maaf, server sedang sibuk atau mati.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fitur 2: Bisa tekan Enter untuk mengirim
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      kirimPesan();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 flex justify-center items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header ala Aplikasi Medis */}
        <div className="bg-blue-600 text-white p-4 flex items-center gap-3 shadow-md z-10">
          <span className="text-3xl">🩺</span>
          <div>
            <h1 className="font-bold text-xl">MedBot AI</h1>
            <p className="text-sm text-blue-100">Konsultasi Edukasi Kesehatan Dasar</p>
          </div>
        </div>

        {/* Fitur 1: Area Chat (Desain Bubble Kanan-Kiri) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed ${
                chat.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
              }`}>
                {chat.text}
              </div>
            </div>
          ))}
          
          {/* Fitur 3: Animasi Loading (Titik melompat) */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-200 p-4 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          {/* Jangkar untuk Auto-scroll */}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Kotak Ketik Pesan */}
        <div className="p-4 bg-white border-t flex gap-3 items-center">
          <input 
            type="text" 
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan medis Anda di sini..."
            className="flex-1 p-3 px-5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={kirimPesan}
            disabled={isLoading || !pesan.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12 shadow-md"
          >
            {/* Ikon Pesawat Kertas (Send) */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -ml-1">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}