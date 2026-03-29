import Link from "next/link";

export default function StrategyPage() {
  return (
    <div className="page-stack max-w-[800px] mx-auto py-12">
      <div className="card stack p-8 border border-primary/20 bg-primary/5">
        <span className="eyebrow text-primary">Bac Excellence Strategy</span>
        <h1 className="section-title text-4xl mt-2 mb-6">How to handle reading passages?</h1>
        
        <div className="stack gap-6 text-lg">
          <p className="opacity-80">
            Reading comprehension in the Tunisian Baccalaureate requires a mix of vocabulary knowledge and skimming strategies. Try following these 3 core steps:
          </p>
          
          <div className="card bg-black/20 p-6 border border-glass">
            <h3 className="text-xl font-bold text-accent mb-2">1. The &apos;Skim &amp; Scan&apos; Method</h3>
            <p className="opacity-70">Don&apos;t read word-for-word on your first pass. Instead, quickly scan the first and last sentence of each paragraph to grasp the main idea before looking at the questions.</p>
          </div>
          
          <div className="card bg-black/20 p-6 border border-glass">
            <h3 className="text-xl font-bold text-primary mb-2">2. Keyword Highlighting</h3>
            <p className="opacity-70">When reading the prompts, highlight the action verbs (Explain, Justify, List) and the specific nouns. Go back to the text and find synonyms of those highlighted nouns.</p>
          </div>
          
          <div className="card bg-black/20 p-6 border border-glass">
            <h3 className="text-xl font-bold text-success mb-2">3. The 15/20 Rule for Justifications</h3>
            <p className="opacity-70">If a question asks you to &quot;Justify from the text&quot;, do NOT try to explain it in your own words. Write the EXACT snippet from the text between quotes.</p>
          </div>
          
          <div className="row-between mt-8">
            <Link href="/lessons" className="button-link button-secondary">
              ← Back to Library
            </Link>
            <Link href="/diagnostic" className="button-link hover-glow">
              Take a Diagnostic Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
