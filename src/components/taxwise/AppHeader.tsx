import { ReceiptText } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <ReceiptText size={32} />
        <h1 className="text-3xl font-headline font-semibold">TaxWise AI</h1>
      </div>
    </header>
  );
}
