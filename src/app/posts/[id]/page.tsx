"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Post } from "@/app/_types/Post";

export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);

      const res = await fetch(`/api/posts/${id}`);
      const { data } = await res.json();
      setPost(data);
      setIsLoading(false);
    };
    fetcher();
  }, [id]);

  if (isLoading) {
    return <p className="my-8 mx-auto max-w-3xl px-4">読み込み中...</p>;
  }

  if (!post) {
    return (
      <div className="my-8 mx-auto max-w-3xl px-4">
        <p>投稿が見つかりません</p>
      </div>
    );
  }
  return (
    <>
      <div className="">
        <div>
          <div className="my-8 mx-auto max-w-3xl px-4">
            <div>
              <div className="h-auto max-w-full">
                <Image
                  src={post.thumbnailUrl}
                  alt=""
                  width={800}
                  height={400}
                />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <div className="text-xs text-[#888]">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex">
                  {post.postCategories.map((postCategory) => (
                    <div
                      key={postCategory.category.id}
                      className="border rounded text-[#06c] border-[#06c] mr-2 px-1 py-0.5"
                    >
                      {postCategory.category.name}
                    </div>
                  ))}
                </div>
              </div>
              <h1 className="text-2xl mt-2 mb-4">{post.title}</h1>
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
