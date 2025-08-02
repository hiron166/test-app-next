"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Post } from "./_types/Post";

export default function Top() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("api/posts");
      const { posts } = await res.json();
      setPosts(posts);
      setIsLoading(false);
    };

    fetcher();
  }, []);

  if (isLoading) {
    return <p className="my-8 mx-auto max-w-3xl px-4">読み込み中...</p>;
  } else {
    return (
      <>
        <div>
          <div className="my-8 mx-auto max-w-3xl px-4">
            <ul>
              {posts.map((post) => (
                <li key={post.id} className="flex flex-col  text-[#333] ">
                  <Link href={`/posts/${post.id}`}>
                    <div className=" mb-8 border p-4 border-[#ccc]">
                      <div className="flex justify-between">
                        <div className="text-xs text-[#888]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex">
                          {post.postCategories.map((pc) => (
                            <div
                              key={pc.category.id}
                              className="border rounded text-[#06c] border-[#06c] mr-2 px-1 py-0.5"
                            >
                              {pc.category.name}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-2xl mt-2 mb-4">{post.title}</p>
                      <div
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className="line-clamp-2"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
}
