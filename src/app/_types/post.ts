import { Category } from "@/app/_types/Category";

export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  postCategories: { category: Category }[];
  thumbnailUrl: string;
};
