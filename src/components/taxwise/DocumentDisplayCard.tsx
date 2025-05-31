import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage } from 'lucide-react';

interface DocumentDisplayCardProps {
  imageDataUri: string | null;
}

export default function DocumentDisplayCard({ imageDataUri }: DocumentDisplayCardProps) {
  if (!imageDataUri) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="text-primary" />
          Uploaded Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[8.5/11] border rounded-md overflow-hidden bg-muted">
          <Image
            src={imageDataUri}
            alt="Uploaded tax document"
            layout="fill"
            objectFit="contain"
            data-ai-hint="tax document"
          />
        </div>
      </CardContent>
    </Card>
  );
}
