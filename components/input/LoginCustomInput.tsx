import React, { useState } from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { CustomInput } from '@/types'
import { Eye, EyeOff } from 'lucide-react'

const LoginCustomInput = ({ control, name, label, placeholder, id }: CustomInput) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col w-full">
          {/* Wrapper div to hold label and input side by side */}
          <div className="flex items-center space-x-4"> 
            <FormLabel className="flex-none w-1/4">
              {label}
            </FormLabel>
            <FormControl className="flex-grow w-3/4">
              <div className="relative">
                <Input 
                  id={id}
                  placeholder={placeholder}
                  className="input-class"
                  type={name === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                  {...field}
                />
                {name === 'password' && (
                  <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </button>
                )}
              </div>
            </FormControl>
          </div>
            <FormMessage className="form-message mt-2" />
        </div>
      )}
    />
  )
}

export default LoginCustomInput