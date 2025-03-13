import { imageUploadHandler } from "@/actions/categories";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuid } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function uploadFile(file: File) {
  const uid = uuid();
  const fileName = `product/product-${uid}-${file.name}`;
  const formData = new FormData();
  formData.append('file', file, fileName);
  return imageUploadHandler(formData);
};