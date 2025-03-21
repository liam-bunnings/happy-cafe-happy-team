import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2">
      <h1 className="text-[#0D5257] text-4xl font-bold mb-8">Welcome to the Bunnings Cafe</h1>
      <p className="text-xl mb-4">View and pre-order or give suggestions on the cafe menu</p>
      <div className="flex w-3/4 mt-8 justify-between">
        <Link href="/customer" className="flex flex-col items-center cursor-pointer bg-[#0D5257] text-white">
          <div className="flex justify-between w-full px-2 py-2 align-baseline">
            <p className="mt-2 text-left">This week's menu</p>
            <Image src="/chevron.svg" width={20} height={20} alt="Arrow right" />
          </div>
          <Image src="/current-menu.png" width={400} height={400} alt="Current week's menu" />
        </Link>
        <Link href={{ pathname: "/customer", query: { week: "next" }}} className="flex flex-col items-center cursor-pointer bg-[#0D5257] text-white">
          <div className="flex justify-between w-full align-baseline px-2 py-2">
            <p className="mt-2 text-left">Next week's menu</p>
            <Image src="/chevron.svg" width={20} height={20} alt="Arrow right" />
          </div>
          <Image src="/next-week.png" width={400} height={400} alt="Next week's menu" />
        </Link>
        <Link href="/customer/suggestions" className="flex flex-col items-center cursor-pointer bg-[#0D5257] text-white">
          <div className="flex justify-between w-full align-baseline px-2 py-2">
            <p className="mt-2 text-left">Give suggestions</p>
            <Image src="/chevron.svg" width={20} height={20} alt="Arrow right" />
          </div>
          <Image src="/feedback.png" width={400} height={400} alt="Give suggestions" />
        </Link>
      </div>
    </main>
  );
}
