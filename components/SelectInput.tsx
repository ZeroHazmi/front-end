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
import { CustomSelectInput } from "@/types";

const SelectInput = ({
  control,
  name,
  label,
  placeholder,
  options,
  setValue,
}: CustomSelectInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex w-full space-x-4 mt-2 mb-2">
            <FormLabel className="flex-none w-1/4">{label}</FormLabel>
            <FormControl className="flex-none w-3/4">
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}  // Update form value on change
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(options)
                    ? options.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      ))
                    : Object.entries(options).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
          <FormMessage className="flex justify-center items-center" />
        </FormItem>
      )}
    />
  );
};

export default SelectInput;
