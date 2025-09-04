"use client";

import { DetailData } from "@/app/_types/DetailData";
import { Post } from "@/app/_types/Post";
import { supabase } from "@/utils/supabase";
import { useParams } from "next/navigation";
import useSWR from "swr";

export const useFetchDetail = <T = DetailData>() => {
  const { id } = useParams();

  const fetcher = async (url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch error");

    const json = await res.json();
    const post: Post = json.post;

    // サムネイルURLをSupabaseから取得
    let thumbnailImageUrl: string | null = null;
    if (post?.thumbnailImageKey) {
      const { data } = supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      thumbnailImageUrl = data.publicUrl;
    }
    return { post, thumbnailImageUrl } as T;
  };
  const { data, error } = useSWR<T>(id ? `/api/posts/${id}` : null, fetcher);

  const isLoading = !data && !error;
  return { data, error, isLoading };
};
