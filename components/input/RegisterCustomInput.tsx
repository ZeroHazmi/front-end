import React from 'react'
import { CustomInput } from '@/types'
import { FormControl, FormField, FormLabel, FormMessage} from '../ui/form'
import { Input } from '../ui/input'

const RegisterCustomInput = ({ control, name, label, placeholder, id }: CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col w-full mb-2 mt-2">
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
                type={name === 'password' || name === 'repassword' ? 'password' : name === 'birthday' ? 'date' : 'text'}
                {...field} // Spread the field props
              />
            </FormControl>
          </div>
          <FormMessage className="flex justify-center items-center" />
        </div>
      )}
    />
  )
}

export default RegisterCustomInput
