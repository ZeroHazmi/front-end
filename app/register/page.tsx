"use client"

import { RegistrationForm } from "@/components/user/registration-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 overflow-hidden">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Borang Pendaftaran</h1>
          <RegistrationForm />
        </div>
      </main>
    </div>
  )
}
