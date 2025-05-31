'use server';

import { taxFormSimplification, type TaxFormSimplificationInput, type TaxFormSimplificationOutput } from '@/ai/flows/tax-form-simplification';
import { personalizedDeductionSuggestions, type PersonalizedDeductionSuggestionsInput, type PersonalizedDeductionSuggestionsOutput } from '@/ai/flows/personalized-deduction-suggestions';
import { assessTaxFormRisk, type AssessTaxFormRiskInput, type AssessTaxFormRiskOutput } from '@/ai/flows/risk-assessment';

export async function simplifyTaxFormAction(input: TaxFormSimplificationInput): Promise<TaxFormSimplificationOutput | { error: string }> {
  try {
    const result = await taxFormSimplification(input);
    return result;
  } catch (error) {
    console.error("Error in simplifyTaxFormAction:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred during tax form simplification." };
  }
}

export async function getDeductionSuggestionsAction(input: PersonalizedDeductionSuggestionsInput): Promise<PersonalizedDeductionSuggestionsOutput | { error: string }> {
  try {
    const result = await personalizedDeductionSuggestions(input);
    return result;
  } catch (error) {
    console.error("Error in getDeductionSuggestionsAction:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred while fetching deduction suggestions." };
  }
}

export async function getRiskAssessmentAction(input: AssessTaxFormRiskInput): Promise<AssessTaxFormRiskOutput | { error: string }> {
  try {
    const result = await assessTaxFormRisk(input);
    return result;
  } catch (error) {
    console.error("Error in getRiskAssessmentAction:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred during risk assessment." };
  }
}
