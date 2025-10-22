"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FilterOption {
  name: string;
  label: string;
  options: string[];
  initialValue?: string;
}

interface FiltersProps {
  filters: FilterOption[];
}

const Filters = ({ filters }: FiltersProps) => {
  const router = useRouter();

  const [values, setValues] = useState(
    Object.fromEntries(
      filters.map((f) => [f.name, f.initialValue || f.options[0]])
    )
  );

  const handleApply = () => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(values).forEach(([key, value]) => {
      if (value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {filters.map((filter) => (
        <div key={filter.name} className="flex flex-col">
          <label className="mb-1 text-sm font-medium">{filter.label}</label>
          <Select
            value={values[filter.name]}
            onValueChange={(val) =>
              setValues((prev) => ({ ...prev, [filter.name]: val }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
};

export default Filters;
