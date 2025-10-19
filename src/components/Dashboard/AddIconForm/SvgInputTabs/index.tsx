"use client";

import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Type } from "lucide-react";
import { InputMode, ISvgInputProps } from "@/types/icon/client";

const SvgInputTabs = ({
  inputMode,
  onInputModeChange,
  form,
  onFileUpload,
}: ISvgInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Tabs
      value={inputMode}
      onValueChange={(value) => onInputModeChange(value as InputMode)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Paste Text
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload File
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="mt-3">
        <Textarea
          className="resize-none overflow-auto max-h-48"
          placeholder="Paste your SVG code here"
          id="svgIcon"
          {...form.register("svgIcon")}
        />
      </TabsContent>

      <TabsContent value="upload" className="mt-3">
        <div className="space-y-2 w-full">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={onFileUpload}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SvgInputTabs;
