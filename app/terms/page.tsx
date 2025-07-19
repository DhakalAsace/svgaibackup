import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SVG AI',
  description: 'Terms and conditions for using SVG AI services.',
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: January 17, 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance</h2>
          <p>By using SVG AI, you agree to these terms. If you disagree, please don't use our services.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. Services</h2>
          <p className="mb-2">We provide:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Free file conversion tools</li>
            <li>AI-powered SVG generation (paid)</li>
            <li>SVG to video export (paid)</li>
            <li>Educational content about vector graphics</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Usage Rules</h2>
          <p className="mb-2">You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Upload illegal, harmful, or copyrighted content</li>
            <li>Attempt to hack, overload, or damage our services</li>
            <li>Scrape or automate without permission</li>
            <li>Resell or redistribute our services</li>
            <li>Use our tools for spam or malicious purposes</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Content Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Your content:</strong> You retain all rights to files you upload/create</li>
            <li><strong>Our content:</strong> SVG AI owns the website, tools, and educational content</li>
            <li><strong>AI-generated content:</strong> You own what you create with our AI tools</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. Paid Services</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Credit packages are non-refundable</li>
            <li>Credits expire after 12 months</li>
            <li>Prices may change with 30 days notice</li>
            <li>Subscriptions auto-renew unless cancelled</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Liability</h2>
          <p className="mb-2">We provide services "as is" without warranties. We're not liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Data loss or file corruption</li>
            <li>Service interruptions</li>
            <li>Indirect or consequential damages</li>
            <li>Third-party actions</li>
          </ul>
          <p className="mt-2">Our maximum liability is limited to the amount you paid us in the last 12 months.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Termination</h2>
          <p>We may suspend or terminate accounts that violate these terms. You can delete your account anytime.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Changes</h2>
          <p>We may update these terms. Continued use means acceptance of new terms.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">9. Governing Law</h2>
          <p>These terms are governed by US law. Disputes will be resolved in US courts.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">10. Contact</h2>
          <p>Questions? Email us at legal@svgai.org</p>
        </div>
      </section>
    </div>
  )
}