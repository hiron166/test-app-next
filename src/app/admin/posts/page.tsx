"use client";

import Link from "next/link";
import { Post } from "@/app/_types/Post";
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
    token ? "/api/admin/posts" : null,
    fetcher
  );
  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>loading...</div>;

  const posts: Post[] = data?.posts ?? [];

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8 p-4">
          <h1 className="text-xl font-bold">記事一覧</h1>
          <button className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded">
            <Link href={"/admin/posts/new"}>新規作成</Link>
          </button>
        </div>

        <div>
          {posts.map((post) => {
            return (
              <Link href={`/admin/posts/${post.id}`} key={post.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{post.title}</div>
                  <div className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
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
