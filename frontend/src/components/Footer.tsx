"use client";
import { usePathname, useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  // Remove leading slash and use as current page
  const currentPage = pathname.substring(1);

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#F2EDE9]">
      <div className="flex justify-around items-center p-4">
        <button
          className={`flex flex-col items-center relative ${currentPage === "home" ? "text-[#A04545]" : "text-gray-500"}`}
          onClick={() => handleNavigation("home")}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>

          {currentPage === "home" && (
            <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
          )}
        </button>
        <button
          className={`flex flex-col items-center relative ${currentPage === "ranking" ? "text-[#A04545]" : "text-gray-500"}`}
          onClick={() => handleNavigation("ranking")}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>

          {currentPage === "ranking" && (
            <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
          )}
        </button>
        <button
          className={`flex flex-col items-center relative ${currentPage === "profile" ? "text-[#A04545]" : "text-gray-500"}`}
          onClick={() => handleNavigation("profile")}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>

          {currentPage === "profile" && (
            <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
}
