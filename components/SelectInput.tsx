import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, UseFormRegisterReturn } from "react-hook-form";
import { CustomSelectInput } from "@/types";

const SelectInput = ({ control, name, label, placeholder, options }: CustomSelectInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex w-full space-x-4">
            <FormLabel className="flex-none w-1/4">{label}</FormLabel>
            <FormControl className="flex-none w-3/4">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(options).map(([key, value]) => (
                      Array.isArray(value) ? (
                        value.map((item, index) => (
                            <SelectItem key={`${key}-${index}`} value={item}>
                                {item}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem key={key} value={key}>
                            {value}
                        </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage className="flex justify-center items-center"/>
        </FormItem>
      )}
    />
  );
};

export default SelectInput;

