"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Post } from "@/app/_types/Post";
import { supabase } from "@/utils/supabase";

export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/${id}`);
        const { post } = await res.json();
        setPost(post);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetcher();
  }, [id]);

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

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
              {thumbnailImageUrl && (
                <div className="h-auto max-w-full">
                  <Image
                    src={thumbnailImageUrl}
                    alt=""
                    width={800}
                    height={400}
                  />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <div className="text-xs text-[#888]">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex">
                  {post.postCategories.map((postCategories) => (
                    <div
                      key={postCategories.category.id}
                      className="border rounded text-[#06c] border-[#06c] mr-2 px-1 py-0.5"
                    >
                      {postCategories.category.name}
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
