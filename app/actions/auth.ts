"use server";

import { redirect } from 'next/navigation'
import { findClientByEmail } from '@/lib/airtable'


export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export async function login(formState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { errors: {
      email: !email ? ['Email is required.'] : undefined,
      password: !password ? ['Password is required.'] : undefined,
    } };
  }

  const client = await findClientByEmail(email);

  if (!client) {
    return { errors: { email: ['Invalid credentials.'] } };
  }

  // Assuming the password in Airtable is stored as plain text for now.
  // In a real application, you would hash and salt passwords.
  if (client.fields.Password !== password) {
    return { errors: { password: ['Invalid credentials.'] } };
  }

  // If login is successful, redirect to the dashboard or home page
  redirect('/');
}