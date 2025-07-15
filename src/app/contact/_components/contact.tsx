"use client";

import React from "react";
import { useForm } from "react-hook-form";
// import "../../globals.css";
import { ContactForm } from "../_types/contactForm";

export const Contact: React.FC = () => {
  const defaultValues = {
    name: "",
    email: "",
    message: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  // サブミット時の処理
  const onSubmit = async (data: ContactForm) => {
    const apiUrl =
      "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts";
    try {
      const res = await fetch(apiUrl, {
        // method: "POST",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "送信に失敗しました");
      }

      const result = await res.json();
      console.log("送信成功:", result);
      alert("お問い合わせ内容を送信しました。");
      reset();
    } catch (errors) {
      console.log("送信エラー:", errors);
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <>
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="name" className="w-[240px]">
              お名前
            </label>
            <div className="w-full">
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "お名前は必須です",
                  maxLength: {
                    value: 30,
                    message: "お名前は30文字以内で入力してください。",
                  },
                })}
                disabled={isSubmitting}
                className="border border-gray-300 rounded-lg p-4 w-full"
              />
              <div className="text-sm text-red-600">{errors.name?.message}</div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="email" className="w-[240px]">
              メールアドレス
            </label>
            <div className="w-full">
              <input
                id="email"
                type="text"
                {...register("email", {
                  required: "メールアドレスは必須です。",
                  pattern: {
                    value: /([a-z\d+\-.]+)@([a-z\d-]+(?:\.[a-z]+)*)/i,
                    message: "メールアドレスの形式が正しくありません。",
                  },
                })}
                disabled={isSubmitting}
                className="border border-gray-300 rounded-lg p-4 w-full"
              />
              <div className="text-sm text-red-600">
                {errors.email?.message}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="name" className="w-[240px]">
              本文
            </label>
            <div className="w-full">
              <textarea
                id="message"
                {...register("message", {
                  required: "本文は必須です。",
                  maxLength: {
                    value: 500,
                    message: "本文は500文字以内で入力してください。",
                  },
                })}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg p-4"
                rows={8}
              />
              <div className="text-sm text-red-600">
                {errors.message?.message}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
            >
              送信
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClear}
              className="bg-gray-200 font-bold py-2 px-4 rounded-lg"
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
