'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    cookies().set('session', 'true', { httpOnly: true, path: '/' });
    redirect('/admin');
  } else {
    return 'Invalid username or password.';
  }
}
