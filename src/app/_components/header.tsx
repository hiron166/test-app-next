"use client";
import  Link from "next/link";
// import "../App.css";

export const Header: React.FC = () => {
  return (
    <>
      <header className="flex justify-between p-6 bg-[#333] text-[#fff] font-bold">
        <Link href="/">Blog</Link>
        <Link href="/contact">お問い合わせ</Link>
      </header>
    </>
  );
};

