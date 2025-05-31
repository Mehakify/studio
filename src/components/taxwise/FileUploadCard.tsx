'use client';

import type { ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface FileUploadCardProps {
  onFileSelect: (fileDataUri: string | null) => void;
  disabled?: boolean;
}

export default function FileUploadCard({ onFileSelect, disabled }: FileUploadCardProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="text-primary" />
          Upload Tax Document
        </CardTitle>
        <CardDescription>Select a scanned or photographed tax form (e.g., W-2, 1099).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="tax-document">Tax Document Image</Label>
          <Input id="tax-document" type="file" accept="image/*" onChange={handleFileChange} disabled={disabled} className="file:text-primary file:font-semibold hover:file:bg-primary/10"/>
        </div>
      </CardContent>
    </Card>
  );
}
