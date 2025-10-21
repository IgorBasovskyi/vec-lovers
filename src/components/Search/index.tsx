"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchBarProps {
  initialSearch?: string;
}

export default function SearchBar({ initialSearch = "" }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    // Don't trigger navigation on initial load if search hasn't changed
    if (search === initialSearch) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.replace(`/dashboard?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [search, router, initialSearch]);

  return (
    <div className="w-full md:w-1/3">
      <Input
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
