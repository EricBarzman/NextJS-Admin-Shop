'use client';

import { FC, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuid } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { CategoryTableRow } from '@/app/admin/categories/category-table-row';
import { createCategorySchema, CreateCategorySchema } from '@/types/categories.schema';
import { CategoriesWithProductsResponse } from '@/types/categories.types';
import { CategoryForm } from '@/app/admin/categories/category-form';
import { createCategory, deleteCategory, imageUploadHandler, updateCategory } from '@/actions/categories';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  categories: CategoriesWithProductsResponse;
};


const CategoriesPageComponent: FC<Props> = ({ categories }: Props) => {

  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CreateCategorySchema | null>(null);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async data => {
    const { image, name, intent = 'create' } = data;

    const uniqueId = uuid();
    const fileName = `category/category-${uniqueId}`;
    const file = new File([image[0]], fileName);
    const formData = new FormData();
    formData.append('file', file);
    const imageUrl = await imageUploadHandler(formData);

    switch (intent) {
      case 'create':
        if (!imageUrl) return;
        await createCategory({ imageUrl, name });
        toast.success('Category created successfully');
        break;

      case 'update':
        if (!(image && currentCategory?.slug) || !(imageUrl)) return;
        await updateCategory({ imageUrl, name, slug: currentCategory.slug, intent: 'update' })
        toast.success('Category uploaded successfully');
        break;
    }

    form.reset();
    router.refresh();
    setIsCreateModalOpen(false);
  }


  const deleteCategoryHandler = async (id: number) => {
    await deleteCategory(id);
    router.refresh();
    toast.success('Category deleted successfully');
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className='flex items-center my-10'>
        <div className='flex items-center gap-2'>
          <div className="ml-auto flex items-center gap-2">
            <Dialog
              open={isCreateModalOpen}
              onOpenChange={() => setIsCreateModalOpen(!isCreateModalOpen)}
            >
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  className='h-8 gap-1'
                  onClick={() => {
                    setCurrentCategory(null);
                    setIsCreateModalOpen(true);
                  }
                  }>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Add category
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  form={form}
                  onSubmit={submitCategoryHandler}
                  defaultValues={currentCategory}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Card className='overflow-x-auto'>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>

        <CardContent>
          <Table className='min-w-[600px]'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] sm:table-cell'>
                  <span className='sr-only'>Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className='md:table-cell'>Created at</TableHead>
                <TableHead className='md:table-cell'>Products</TableHead>
                <TableHead>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(category => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  setCurrentCategory={setCurrentCategory}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  deleteCategoryHandler={deleteCategoryHandler}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default CategoriesPageComponent;