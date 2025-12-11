"use client";

import { login } from '@/app/actions/login'
import { useActionState } from 'react'

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  console.log('Login form state:', state);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-100">
          تسجيل الدخول
        </h2>
        <form action={action} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-400"
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-400"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="cursor-pointer w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              سجل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}