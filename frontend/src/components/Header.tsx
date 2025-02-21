import Image from "next/image";
import WalletWrapper from "src/components/WalletWrapper";

export default function Header() {
  return (
    <header className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Orchid" width={40} height={40} />
          <h1 className="mt-2 text-xl font-serif">Orchid</h1>
        </div>
        <WalletWrapper
          className="min-w-[120px] bg-[#A04545] text-white rounded-lg"
          text="Connect"
        />
      </div>
    </header>
  );
}
