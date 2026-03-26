import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="page-stack max-w-[800px] mx-auto py-12">
      <div className="card stack p-8 border border-primary/20 bg-primary/5">
        <h1 className="section-title text-4xl mb-6">Privacy Policy</h1>
        <div className="stack gap-6 text-lg opacity-80">
          <p>Your privacy is important to us. At Bac Excellence, we only collect data that helps improve your learning experience.</p>
          <h2 className="text-2xl font-bold mt-4">1. Data Collection</h2>
          <p>We collect your email for account identification and your study preferences to tailor your roadmap.</p>
          <h2 className="text-2xl font-bold mt-4">2. Performance Data</h2>
          <p>Your diagnostic results and exercise attempts are stored to provide progress tracking and AI-driven recommendations.</p>
          <h2 className="text-2xl font-bold mt-4">3. Security</h2>
          <p>We use industry-standard encryption to protect your data. We never share your personal information with third parties.</p>
          <div className="mt-8">
            <Link href="/" className="button-link button-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
