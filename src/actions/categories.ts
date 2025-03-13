'use server';

import { CategoriesWithProductsResponse } from "@/types/categories.types";
import { CreateCategorySchemaServer, UpdateCategorySchema } from "@/types/categories.schema";
import { createClient } from "@/supabase/server";
import { File } from "buffer";
import slugify from 'slugify';

const supabase = createClient();

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const { data, error } = await (await supabase)
      .from('category')
      .select('*, products:product(*)')
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error}`)

    return data || [];
  }


export const imageUploadHandler = async (formData: FormData) => {
  const supabase = createClient();
  if (!formData) return;

  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) throw new Error('Expected a file');

  const fileName = fileEntry.name;

  try {
    const { data, error } = await (await supabase).storage
      .from('shop-images')
      .upload(fileName, fileEntry, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }

    const {
      data: { publicUrl },
    } = await (await supabase).storage.from('shop-images').getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
};

export const createCategory = async ({
  imageUrl,
  name
}: CreateCategorySchemaServer) => {

  const slug = slugify(name, { lower: true });

  const { data, error } = await (await supabase)
    .from('category')
    .insert({
      name,
      imageUrl,
      slug
    });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  return data;
}


export const updateCategory = async ({
  imageUrl,
  name,
  slug
}: UpdateCategorySchema) => {

  const { data, error } =
    await (await supabase)
      .from('category')
      .update({ name, imageUrl })
      .match({ slug });

  if (error) throw new Error(`Error updating category: ${error}`);

  return data;
}


export const deleteCategory = async (id: number) => {
  const { error } = await (await supabase)
    .from('category')
    .delete()
    .match({ id });

  if (error) throw new Error(`Error deleting category: ${error}`);
}