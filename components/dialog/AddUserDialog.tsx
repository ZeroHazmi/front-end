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

  const { watch, control, setValue } = form
  const selectedState = watch('state')

  useEffect(() => {
    if (selectedState) {
      const fetchedDistricts = getDistricts(selectedState)
      setDistricts(fetchedDistricts)
    }
  }, [selectedState])

  const onSubmit = async (values: AddUserFormValues) => {
    setIsLoading(true);
    
    // Exclude `repassword` from the payload
    const { repassword, ...filteredValues } = values;
  
    try {
      // Register user via API
      const response = await registerUser(filteredValues);
      
      // Close the dialog before displaying success toast
      await onOpenChange(false);
      
      // Notify parent component about the new user
      onUserAdded(filteredValues);
  
      // Reset the form fields
      form.reset();
  
      // Display success toast
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error("Add user error:", error);
  
      // Close the dialog before displaying error toast
      await onOpenChange(false);
  
      // Display error toast
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <RegisterCustomInput control={control} name="userName" label="Username" placeholder="Enter username" id="username-input"/>
              <RegisterCustomInput control={control} name="password" label="Password" placeholder="Enter password" id="password-input"/>
              <RegisterCustomInput control={control} name="repassword" label="Confirm Password" placeholder="Confirm password" id="repassword-input"/>
              <RegisterCustomInput control={control} name="name" label="Name" placeholder="Enter name" id="name-input"/>
              <RegisterCustomInput control={control} name="email" label="Email" placeholder="Enter email" id="email-input"/>
              <RegisterCustomInput control={control} name="icNumber" label="IC Number" placeholder="Enter IC" id="ic-input"/>
              <RegisterCustomInput control={control} name="birthday" label="Birthdate" placeholder="Enter birthdate" id="birthday-input"/>
              <SelectInput control={control} name="gender" label="Gender" placeholder="Select gender" id="gender-input" options={gender} setValue={setValue}/>
              <SelectInput control={control} name="nationality" label="Nationality" placeholder="Select nationality" id="nationality-input" options={nationality} setValue={setValue}/>
              <SelectInput control={control} name="descendants" label="Descendants" placeholder="Select descendants" id="descendant-input" options={descendants} setValue={setValue}/>
              <SelectInput control={control} name="religion" label="Religion" placeholder="Select religion" id="religion-input" options={religion} setValue={setValue}/>
              <RegisterCustomInput control={control} name="phoneNumber" label="Phone Number" placeholder="Enter phone number" id="phone-input"/>
              <RegisterCustomInput control={control} name="housePhoneNumber" label="House Phone" placeholder="Enter house phone" id="house-phone-input"/>
              <SelectInput control={control} name="state" label="State" placeholder="Select state" id="state-input" options={states} setValue={setValue} />
              <SelectInput control={control} name="district" label="District" placeholder="Select district" id="district-input" options={districts} setValue={setValue} />
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
