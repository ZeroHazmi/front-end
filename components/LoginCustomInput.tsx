import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { loginFormSchema } from '@/lib/utils'
import { CustomInput } from '@/types'

const formSchema = loginFormSchema()

const LoginCustomInput = ({ control, name, label, placeholder, id }: CustomInput) => {
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
              <Input 
                id={id}
                placeholder={placeholder}
                className="input-class"
                type={name === 'password' ? 'password' : 'text'}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  )
}

export default LoginCustomInput