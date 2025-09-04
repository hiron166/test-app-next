"use client";

import Image from "next/image";
import { useFetchDetail } from "../_hooks/useFetchDetail";
import { DetailData } from "@/app/_types/DetailData";

export default function Detail() {
  const { data, error, isLoading } = useFetchDetail<DetailData>();

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  const post = data?.post;
  const thumbnailImageUrl = data?.thumbnailImageUrl ?? null;

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
