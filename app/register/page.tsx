"use client"

import { RegistrationForm } from "@/components/user/registration-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 lg:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Borang Pendaftaran</h1>
          <RegistrationForm />
        </div>
      </main>
    </div>
  )
}
