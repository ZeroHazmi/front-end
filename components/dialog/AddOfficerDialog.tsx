'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { getCookie } from "@/app/lib/auth"
import SelectInput from "../input/SelectInput"
import { gender } from "@/types/constants"
import RegisterCustomInput from "../input/RegisterCustomInput"
import { AddPoliceSchema } from "@/lib/utils"

type AddPoliceFormValues = z.infer<ReturnType<typeof AddPoliceSchema>>

interface AddOfficerDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onOfficerAdded: () => void
}

export default function AddOfficerDialog({
  isOpen,
  onOpenChange,
  onOfficerAdded,
}: AddOfficerDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddPoliceFormValues>({
    resolver: zodResolver(AddPoliceSchema()),
    defaultValues: {
      userName: "",
      name: "",
      password: "",
      repassword: "",
      email: "",
      icNumber: "",
      gender: "",
      phoneNumber: "",
    },
  })

  const onSubmit = async (values: AddPoliceFormValues) => {
    setIsSubmitting(true)
    try {
      const token = await getCookie("session")
      if (!token) {
        toast({
          title: "Error",
          description: "Session token is missing.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("http://localhost:5035/api/police/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to register officer.")
      }

      toast({
        title: "Success",
        description: "Police officer added successfully.",
      })
      onOfficerAdded()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Police Officer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <RegisterCustomInput control={form.control} name="icNumber" label="IC Number" placeholder="Enter your IC" id="ic-input"/>
            <RegisterCustomInput control={form.control} name="name" label="Name" placeholder="Enter your name" id="name-input"/>
            <RegisterCustomInput control={form.control} name="userName" label="Username" placeholder="Enter your username" id="username-input"/>
            <RegisterCustomInput control={form.control} name="password" label="Password" placeholder="Enter your password" id="password-input"/>
            <RegisterCustomInput control={form.control} name="repassword" label="Re-enter Password" placeholder="Enter your typed password" id="repassword-input"/>
            <RegisterCustomInput control={form.control} name="phoneNumber" label="Phone Number" placeholder="Enter your phone number" id="phone-input"/>
            <RegisterCustomInput control={form.control} name="email" label="Email" placeholder="Enter your email" id="email-input"/>
            <SelectInput control={form.control} name="gender" label="Gender" placeholder="Enter your Gender" id="gender-input" options={gender} setValue={form.setValue}/>

            <DialogFooter>
              <Button type="submit" className="bg-police-blue hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Officer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}