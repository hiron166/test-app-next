"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/app/_types/Category";
import { Post } from "@/app/_types/Post";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault();
    // 記事を作成します。
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailImageKey,
          categories,
        }),
      });
      alert("記事を更新しました");
    } catch (e) {
      console.error("記事の更新に失敗しました:", e);
      alert("記事の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("記事を削除しますか？")) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });
      alert("記事を削除しました");
      router.push("/admin/posts");
    } catch (e) {
      console.error("記事の削除に失敗しました:", e);
      alert("記事の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { post }: { post: Post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailImageKey(post.thumbnailImageKey);
      setCategories(post.postCategories.map((pc) => pc.category));
    };
    fetcher();
  }, [id, token]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
