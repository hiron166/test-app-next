"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import { Post } from "@/app/_types/Post";
import { CategoryForm } from "../_components/CategoryForm";

export default function Page() {
  const [name, setName] = useState("");
  const { id } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault();
    // カテゴリーを作成します。
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });
      alert("カテゴリーを更新しました");
    } catch (e) {
      console.error("カテゴリーの更新に失敗しました:", e);
      alert("カテゴリーの更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      alert("カテゴリーを削除しました");
      router.push("/admin/categories");
    } catch (e) {
      console.error("カテゴリーの削除に失敗しました:", e);
      alert("カテゴリーの削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const { category } = await res.json();
      setName(category.name);
    };
    fetcher();
  }, [id]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>
      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
