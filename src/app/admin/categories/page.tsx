"use client";

import Link from "next/link";
import { Category } from "@/app/_types/Category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function Page() {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token!,
      },
    });
    if (!res.ok) throw new Error("");
    return res.json();
  };

  const { data, error, isLoading } = useSWR(
    token ? "/api/admin/categories" : null,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  const categories: Category[] = data?.categories ?? [];

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8 p-4">
          <h1 className="text-xl font-bold">カテゴリー一覧</h1>
          <button className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded">
            <Link href={"/admin/categories/new"}>新規作成</Link>
          </button>
        </div>

        <div>
          {categories.map((category) => {
            return (
              <Link href={`/admin/categories/${category.id}`} key={category.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{category.name}</div>
                  <div className="text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
