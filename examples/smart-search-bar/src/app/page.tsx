import SmartSearchBar from '@/components/SmartSearchBar/SmartSearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E0E0E] flex flex-col items-center pt-32 px-4">
      <h1 className="text-4xl font-bold text-[#E8E8E8] mb-2">Smart Search</h1>
      <p className="text-[#888] mb-8">Find exactly what you&apos;re looking for</p>
      <div className="w-full max-w-3xl">
        <SmartSearchBar />
      </div>
    </main>
  );
}
