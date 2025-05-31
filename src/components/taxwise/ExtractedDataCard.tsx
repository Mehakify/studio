'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileJson2, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtractedDataCardProps {
  jsonData: string;
  onDataChange: (newData: string) => void;
  disabled?: boolean;
}

export default function ExtractedDataCard({ jsonData, onDataChange, disabled }: ExtractedDataCardProps) {
  const [editedData, setEditedData] = useState(jsonData);
  const { toast } = useToast();

  useEffect(() => {
    setEditedData(jsonData);
  }, [jsonData]);

  const handleSave = () => {
    try {
      JSON.parse(editedData); // Validate JSON
      onDataChange(editedData);
      toast({
        title: "Data Updated",
        description: "Mock extracted data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The edited data is not valid JSON. Please correct it.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson2 className="text-primary" />
          Extracted Data (Mock)
        </CardTitle>
        <CardDescription>Review and edit the mock extracted data from your document. This data is used for suggestions and risk assessment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={editedData}
          onChange={(e) => setEditedData(e.target.value)}
          rows={15}
          className="font-code text-sm"
          placeholder="Extracted JSON data will appear here..."
          disabled={disabled}
        />
        <Button onClick={handleSave} disabled={disabled || editedData === jsonData}>
          <Edit3 className="mr-2 h-4 w-4" />
          Save Changes (Mock)
        </Button>
      </CardContent>
    </Card>
  );
}
