"use client";

import { Category } from "@/app/_types/Category";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CategoriesSelect } from "./CategoriesSelect";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  isSubmitting,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }
    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;
    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      alert(error.message);
      return;
    }
    setThumbnailImageKey(data.path);
  };

  useEffect(() => {
    if (!thumbnailImageKey) return;

    //デバッグ用
    console.log("thumbnailImageKey changed:", thumbnailImageKey);
    if (!thumbnailImageKey) {
      console.log("thumbnailImageKey is empty, returning");
      return;
    }

    const fetcher = async () => {
      // デバッグ用
      console.log("Fetching public URL for:", thumbnailImageKey);

      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      // デバッグ用
      console.log("Generated public URL:", publicUrl);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          // accept="image/*"
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <button
        type="submit"
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isSubmitting}
      >
        {mode === "new" ? "作成" : "更新"}
      </button>
      {mode === "edit" && (
        <button
          type="button"
          onClick={onDelete}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          disabled={isSubmitting}
        >
          削除
        </button>
      )}
    </form>
  );
};
