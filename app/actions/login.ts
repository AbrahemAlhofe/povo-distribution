"use server";

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers';
import { DatabaseClient } from '@/lib/database';
import { DATABASE_CONFIG, ClientRecord } from '@/lib/schema';

type FormState =
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

  console.log('Login attempt for email:', email);

  if (!email || !password) {
    return { errors: {
      email: !email ? ['Email is required.'] : undefined,
      password: !password ? ['Password is required.'] : undefined,
    } };
  }

  const client = await DatabaseClient.getOneRecordByFormula<ClientRecord>(DATABASE_CONFIG.tables.clients.id, `(email,eq,${email})`);

  console.log(client);

  if (!client) {
    return { errors: { email: ['Invalid credentials.'] } };
  }

  // Assuming the password in Airtable is stored as plain text for now.
  // In a real application, you would hash and salt passwords.
  if (client.password !== password) {
    return { errors: { password: ['Invalid credentials.'] } };
  }

  // Set session cookie (this is a simplified example; use secure methods in production)
  const session = {
    email: client.email,
    name: client.client_name,
    id: client.id,
  };

  (await cookies()).set({
    name: 'session',
    value: encodeURIComponent(JSON.stringify(session)),
    maxAge: 60 * 60 * 24 * 7
  });

  // If login is successful, redirect to the dashboard or home page
  redirect('/');
}