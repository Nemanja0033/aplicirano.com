"use client"
import Confetti from 'react-confetti'

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 text-primary font-bold">
      <h1 className="text-4xl">Dostupno od 31 Januara!</h1>
      <Confetti width={2000} height={800} />
    </div>
  );
};

export default MaintenancePage;
