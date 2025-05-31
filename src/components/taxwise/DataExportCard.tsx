'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DataExportCardProps {
  jsonData: string;
  fileName?: string;
  disabled?: boolean;
}

export default function DataExportCard({ jsonData, fileName = 'taxwise_ai_data.json', disabled }: DataExportCardProps) {
  const handleExport = () => {
    if (disabled) return;
    try {
      // Validate JSON before exporting
      JSON.parse(jsonData);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error: Data is not valid JSON and cannot be exported.");
      console.error("Export error: ", error);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="text-primary" />
          Export Data
        </CardTitle>
        <CardDescription>Download your (mock) extracted and verified tax data in JSON format.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} disabled={disabled || !jsonData} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export as JSON
        </Button>
      </CardContent>
    </Card>
  );
}
