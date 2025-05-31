'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { simplifyTaxFormAction, getDeductionSuggestionsAction, getRiskAssessmentAction } from '@/lib/actions';
import type { TaxFormSimplificationOutput } from '@/ai/flows/tax-form-simplification';
import type { PersonalizedDeductionSuggestionsOutput } from '@/ai/flows/personalized-deduction-suggestions';
import type { AssessTaxFormRiskOutput } from '@/ai/flows/risk-assessment';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertTriangle, BadgePercent, BookOpenText, FileWarning, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AiInsightsTabsProps {
  photoDataUri: string | null;
  extractedJsonData: string;
  onProcessingComplete: (status: boolean) => void;
}

const AiInsightDisplayItem: React.FC<{ title: string; content: string | string[]; icon?: React.ReactNode; isList?: boolean; isLoading?: boolean; error?: string | null }> = ({ title, content, icon, isList, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {icon && <div className="flex items-center gap-2 text-lg font-semibold mb-2">{icon}{title}</div>}
        {!icon && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error processing {title}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-2">
      {icon && <div className="flex items-center gap-2 text-lg font-semibold mb-2">{icon}{title}</div>}
      {!icon && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {isList && Array.isArray(content) ? (
        <ul className="list-disc list-inside space-y-1">
          {content.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{typeof content === 'string' ? content : 'No content available.'}</p>
      )}
    </div>
  );
};


export default function AiInsightsTabs({ photoDataUri, extractedJsonData, onProcessingComplete }: AiInsightsTabsProps) {
  const { toast } = useToast();
  const [simplificationResult, setSimplificationResult] = useState<TaxFormSimplificationOutput | null>(null);
  const [deductionResult, setDeductionResult] = useState<PersonalizedDeductionSuggestionsOutput | null>(null);
  const [riskResult, setRiskResult] = useState<AssessTaxFormRiskOutput | null>(null);

  const [loadingSimplification, setLoadingSimplification] = useState(false);
  const [loadingDeductions, setLoadingDeductions] = useState(false);
  const [loadingRisk, setLoadingRisk] = useState(false);
  
  const [errorSimplification, setErrorSimplification] = useState<string | null>(null);
  const [errorDeductions, setErrorDeductions] = useState<string | null>(null);
  const [errorRisk, setErrorRisk] = useState<string | null>(null);

  useEffect(() => {
    if (photoDataUri) {
      setSimplificationResult(null);
      setDeductionResult(null);
      setRiskResult(null);
      setErrorSimplification(null);
      setErrorDeductions(null);
      setErrorRisk(null);
      onProcessingComplete(true); // Indicate processing has started

      const processAll = async () => {
        // 1. Simplification
        setLoadingSimplification(true);
        const simplificationResponse = await simplifyTaxFormAction({ photoDataUri });
        if ('error' in simplificationResponse) {
          setErrorSimplification(simplificationResponse.error);
          toast({ title: "Simplification Error", description: simplificationResponse.error, variant: "destructive" });
        } else {
          setSimplificationResult(simplificationResponse);
        }
        setLoadingSimplification(false);

        // 2. Deductions (uses mock/edited extractedJsonData)
        setLoadingDeductions(true);
        const deductionsResponse = await getDeductionSuggestionsAction({ extractedData: extractedJsonData });
        if ('error' in deductionsResponse) {
          setErrorDeductions(deductionsResponse.error);
          toast({ title: "Deduction Suggestion Error", description: deductionsResponse.error, variant: "destructive" });
        } else {
          setDeductionResult(deductionsResponse);
        }
        setLoadingDeductions(false);

        // 3. Risk Assessment (uses mock/edited extractedJsonData)
        setLoadingRisk(true);
        const riskResponse = await getRiskAssessmentAction({ extractedData: extractedJsonData });
        if ('error' in riskResponse) {
          setErrorRisk(riskResponse.error);
          toast({ title: "Risk Assessment Error", description: riskResponse.error, variant: "destructive" });
        } else {
          setRiskResult(riskResponse);
        }
        setLoadingRisk(false);
        onProcessingComplete(false); // Indicate processing has finished
      };
      processAll();
    }
  }, [photoDataUri, extractedJsonData, toast, onProcessingComplete]);

  if (!photoDataUri) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>Upload a tax document to get AI-powered explanations, suggestions, and risk assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Insights will appear here once a document is processed.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="simplification" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-secondary">
        <TabsTrigger value="simplification">
          <BookOpenText className="mr-2 h-4 w-4" /> Simplification
        </TabsTrigger>
        <TabsTrigger value="deductions">
          <BadgePercent className="mr-2 h-4 w-4" /> Deductions
        </TabsTrigger>
        <TabsTrigger value="risk">
          <AlertTriangle className="mr-2 h-4 w-4" /> Risk Assessment
        </TabsTrigger>
      </TabsList>

      <TabsContent value="simplification">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpenText className="text-primary" />Tax Form Simplification</CardTitle>
            <CardDescription>Understand your tax form with plain language explanations.</CardDescription>
          </CardHeader>
          <CardContent>
            <AiInsightDisplayItem 
              title="Simplified Explanation" 
              content={simplificationResult?.simplifiedExplanation || "No explanation available."}
              isLoading={loadingSimplification}
              error={errorSimplification}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deductions">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BadgePercent className="text-primary" />Personalized Deduction Suggestions</CardTitle>
            <CardDescription>Discover potential deductions and credits based on your (mock) form data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AiInsightDisplayItem 
              title="Suggested Deductions" 
              icon={<ListChecks />}
              content={deductionResult?.suggestions || ["No suggestions available."]}
              isList 
              isLoading={loadingDeductions}
              error={errorDeductions}
            />
            {deductionResult?.warnings && deductionResult.warnings.length > 0 && (
               <AiInsightDisplayItem 
                title="Potential Warnings" 
                icon={<FileWarning />}
                content={deductionResult.warnings}
                isList 
                isLoading={loadingDeductions}
                error={errorDeductions} // Show error only once if loading is for both
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="risk">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-primary" />Risk Assessment</CardTitle>
            <CardDescription>Identify potential red flags or inconsistencies in your (mock) tax data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AiInsightDisplayItem 
              title="Risk Analysis" 
              icon={<FileWarning />}
              content={riskResult?.riskAssessment || "No risk assessment available."}
              isLoading={loadingRisk}
              error={errorRisk}
            />
            {riskResult?.redFlags && riskResult.redFlags.length > 0 && (
              <AiInsightDisplayItem 
                title="Identified Red Flags" 
                icon={<AlertTriangle />}
                content={riskResult.redFlags}
                isList 
                isLoading={loadingRisk}
                error={errorRisk} 
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
