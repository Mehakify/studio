'use client';

import { useState } from 'react';
import AppHeader from '@/components/taxwise/AppHeader';
import AppFooter from '@/components/taxwise/AppFooter';
import FileUploadCard from '@/components/taxwise/FileUploadCard';
import DocumentDisplayCard from '@/components/taxwise/DocumentDisplayCard';
import ExtractedDataCard from '@/components/taxwise/ExtractedDataCard';
import AiInsightsTabs from '@/components/taxwise/AiInsightsTabs';
import DataExportCard from '@/components/taxwise/DataExportCard';
import { Loader2 } from 'lucide-react';

const initialMockJsonData = JSON.stringify({
  formType: "W-2",
  year: new Date().getFullYear() -1,
  employee: {
    name: "Jane Doe",
    ssn: "XXX-XX-XXXX",
    address: "123 Taxpayer Ln, Filecity, ST 54321"
  },
  employer: {
    name: "AI Solutions Inc.",
    ein: "XX-XXXXXXX",
    address: "789 Innovation Dr, Techville, ST 12345"
  },
  income: {
    wages: 75000,
    federalWithheld: 8000,
    stateWithheld: 3000,
    socialSecurityWages: 75000,
    socialSecurityTaxWithheld: 4650,
    medicareWagesAndTips: 75000,
    medicareTaxWithheld: 1087.50
  }
}, null, 2);

export default function TaxWiseAiPage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [mockJsonData, setMockJsonData] = useState<string>(initialMockJsonData);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelect = (fileUri: string | null) => {
    setPhotoDataUri(fileUri);
    if (!fileUri) { // Reset if file is deselected
        setIsProcessing(false);
    }
  };
  
  const handleMockDataChange = (newData: string) => {
    setMockJsonData(newData);
  };

  const handleProcessingComplete = (status: boolean) => {
    setIsProcessing(status);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <FileUploadCard onFileSelect={handleFileSelect} disabled={isProcessing} />
            {photoDataUri && <DocumentDisplayCard imageDataUri={photoDataUri} />}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {isProcessing && (
              <div className="flex items-center justify-center p-8 bg-card rounded-lg shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                <p className="text-lg font-semibold">AI is analyzing your document...</p>
              </div>
            )}
            
            {photoDataUri && !isProcessing && (
              <>
                <ExtractedDataCard jsonData={mockJsonData} onDataChange={handleMockDataChange} disabled={isProcessing} />
                <DataExportCard jsonData={mockJsonData} disabled={isProcessing || !mockJsonData} />
              </>
            )}
            
            <AiInsightsTabs 
                photoDataUri={photoDataUri} 
                extractedJsonData={mockJsonData}
                onProcessingComplete={handleProcessingComplete}
            />

          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
