export default function AppFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} TaxWise AI. All rights reserved.</p>
        <p className="mt-1 font-semibold">
          Disclaimer: TaxWise AI provides assistance and explanations based on AI. 
          It is not a substitute for professional tax advice. Always consult a qualified tax professional for final verification and submission.
        </p>
      </div>
    </footer>
  );
}
