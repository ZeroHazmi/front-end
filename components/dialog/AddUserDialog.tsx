'use client'

import { useState, useEffect } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { gender, nationality, descendants, religion, states } from '@/types/constants'
import { getDistricts, signUpFormSchema } from '@/lib/utils'

// Import the custom input components
import RegisterCustomInput from '@/components/input/RegisterCustomInput'
import SelectInput from '@/components/input/SelectInput'
import { registerUser } from '@/actions/user'

type AddUserFormValues = z.infer<ReturnType<typeof signUpFormSchema>>

interface AddUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (user: AddUserFormValues) => void;
}

export default function AddUserDialog({ isOpen, onOpenChange, onUserAdded }: AddUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [districts, setDistricts] = useState<string[]>([])

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(signUpFormSchema()),
    defaultValues: {
      userName: "",
      password: "",
      name: "",
      email: "",
      icNumber: "",
      birthday: "",
      gender: "",
      nationality: "",
      descendants: "",
      religion: "",
      phoneNumber: "",
      housePhoneNumber: "",
      officePhoneNumber: "",
      address: "",
      postcode: "",
      region: "",
      state: "",
      repassword: "",
    },
  })

  const { watch, reset } = form
  const selectedState = watch('state')

  useEffect(() => {
      if (selectedState) {
          const districts = getDistricts(selectedState);
          setDistricts(districts);
      }
  }, [selectedState])

  const onSubmit = async (values: AddUserFormValues) => {
    console.log('Submitting Form Values:', values);
    setIsLoading(true)
    try {
      const { repassword, ...userDataToSubmit } = values
      const response = await registerUser(userDataToSubmit)
      console.log("API Response:", response);
      
      if (response) {
        onOpenChange(false)
        onUserAdded(userDataToSubmit)
        reset() // Reset the form
        toast({
          title: "Success",
          description: "User added successfully",
        })
      } else {
        throw new Error(response.message || "Failed to add user")
      }
    } catch (error: any) {
      console.error("Add user error:", error.message);
    
      // Check for error details in the response, assuming the response might contain more details
      if (error?.response?.data?.message) {
        // Retrieve and show the error message from the response
        toast({
          title: "Error",
          description: error.response.data.message || "Failed to add user",
          variant: "destructive",
        });
      } else {
        // Fallback error message in case the error does not contain a response
        toast({
          title: "Error",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details of the new user below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <RegisterCustomInput control={form.control} name='icNumber' label="IC Number" placeholder='Enter your IC' id='ic-input'/>
                <RegisterCustomInput control={form.control} name='name' label="Name" placeholder='Enter your name' id='name-input'/>
                <RegisterCustomInput control={form.control} name='userName' label="Username" placeholder='Enter your username' id='username-input'/>
                <RegisterCustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' id='password-input'/>
                <RegisterCustomInput control={form.control} name='repassword' label="Re-enter Password" placeholder='Enter your typed password' id='repassword-input'/>
                <RegisterCustomInput control={form.control} name='phoneNumber' label="Phone Number" placeholder='Enter your phone number' id='phone-input'/>
                <RegisterCustomInput control={form.control} name='housePhoneNumber' label="House Phone Number" placeholder='Enter your house phone number' id='house-phone-input'/>
                <RegisterCustomInput control={form.control} name='officePhoneNumber' label="Office Phone Number" placeholder='Enter your office phone number' id='office-phone-input'/>
                <RegisterCustomInput control={form.control} name='birthday' label="Birthdate" placeholder='Enter your birthdate' id='birthday-input'/>
                <SelectInput control={form.control} name='gender' label="Gender" placeholder='Enter your Gender' id='gender-input' options={gender} setValue={form.setValue}/>
                <SelectInput control={form.control} name='nationality' label="Nationality" placeholder='Enter your nationality' id='nationality-input' options={nationality}/>
                <SelectInput control={form.control} name='descendants' label="Descendants" placeholder='Enter your descendants' id='descendant-input' options={descendants}/>
                <SelectInput control={form.control} name='religion' label="Religion" placeholder='Enter your Religion' id='religion-input' options={religion} />
                <RegisterCustomInput control={form.control} name='address' label="Address" placeholder='Enter your address' id='address-input'/>
                <RegisterCustomInput control={form.control} name='postcode' label="Postcode" placeholder='Enter your postcode' id='postcode-input'/>
                <SelectInput control={form.control} name='state' label="States" placeholder='Select a State' id='state-input' options={states} />
                <SelectInput control={form.control} name='region' label="Districts" placeholder='Select a district' id='district-input' options={districts}  />
                <RegisterCustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' id='email-input'/>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
