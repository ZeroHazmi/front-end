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
          <FormLabel>{label}</FormLabel>
          <FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectInput;
