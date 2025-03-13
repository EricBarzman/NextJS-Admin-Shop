import { ADMIN } from "@/constants/constants";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children
}: Readonly<{
  children : ReactNode
}>) {

  const supabase = createClient();
  const { data : authData } = await (await supabase).auth.getUser();

  // Check if already logged in
  if (authData?.user) {
    const { data, error } = await (await supabase)
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (error || !data) {
      console.log('Error fetching user data: ', error);
      return;
    }

    if (data.type === ADMIN) return redirect('/admin');
  }

  // User is not authenticated so we return the login page
  return (
    <>
     {children}
    </>
  )
}