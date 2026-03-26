import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="page-stack max-w-[800px] mx-auto py-12">
      <div className="card stack p-8 border border-primary/20 bg-primary/5">
        <h1 className="section-title text-4xl mb-6">Terms of Service</h1>
        <div className="stack gap-6 text-lg opacity-80">
          <p>By using Bac Excellence, you agree to the following terms and conditions.</p>
          <h2 className="text-2xl font-bold mt-4">1. Personal Use Only</h2>
          <p>This platform and its content are for individual study purposes only. Unauthorized redistribution of its learning material or AI-generated answers is strictly prohibited.</p>
          <h2 className="text-2xl font-bold mt-4">2. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account password.</p>
          <h2 className="text-2xl font-bold mt-4">3. Premium Features</h2>
          <p>Access to certain features may require a premium subscription. This subscription is non-transferable and subject to our billing policies.</p>
          <div className="mt-8">
            <Link href="/" className="button-link button-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
