"use client";

import { useEffect, useState } from "react";
// import "./globals.css";
// import { posts } from "./_data/posts";
import Link from "next/link";
import { Post } from "./_types/post";

export default function Top () {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
        );
        const data = await res.json();
        setPosts(data.posts);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
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
                          {post.categories.map((category) => (
                            <div
                              key={category}
                              className="border rounded text-[#06c] border-[#06c] mr-2 px-1 py-0.5"
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-2xl mt-2 mb-4">{`APIで取得した${post.title}`}</p>
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
};
