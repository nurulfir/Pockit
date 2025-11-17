import { Wallet } from 'lucide-react';

export const Header = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Wallet className="w-8 h-8 text-indigo-600" />
      <h1 className="text-3xl font-bold text-gray-800">
        Tracker Keuangan Mahasiswa
      </h1>
    </div>
  );
};