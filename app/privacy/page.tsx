import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SVG AI',
  description: 'Our commitment to protecting your privacy and data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: January 17, 2025</p>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
        <p className="text-sm">
          <strong>Quick Summary:</strong> Most of our converters work entirely in your browser - your files never leave your device. 
          Some advanced formats require server processing for technical reasons, but files are encrypted, processed, and immediately deleted. 
          We never store, access, or share your files.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Data Collection</h2>
          <p className="mb-2">We collect minimal data to provide our services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Files you upload for conversion (temporarily)</li>
            <li>Basic analytics (page views, conversion counts)</li>
            <li>Account information (email, password) for registered users</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. File Processing</h2>
          <p className="mb-2"><strong>Browser-based converters:</strong> Most conversions happen entirely in your browser. Files never leave your device.</p>
          <p className="mb-2"><strong>Advanced format converters:</strong> Complex formats (AI, EMF, WMF, AVIF, animated GIF) require specialized processing:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Files are uploaded to secure servers for processing</li>
            <li>Transmitted securely over HTTPS connection</li>
            <li>Processed using enterprise-grade conversion engines</li>
            <li>Automatically deleted immediately after conversion completes</li>
            <li>Never stored permanently, logged, or accessed by humans</li>
            <li>No backups or copies are retained</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Payment Processing:</strong> Stripe handles all payments securely (we never see your card details)</li>
            <li><strong>Analytics:</strong> Vercel Analytics for anonymous usage statistics</li>
            <li><strong>Infrastructure:</strong> Enterprise cloud services for secure file processing</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your account data anytime</li>
            <li>Delete your account and all associated data</li>
            <li>Export your created content</li>
            <li>Opt-out of marketing emails</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. Security</h2>
          <p>We use industry-standard security measures:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>HTTPS encryption for all data transfers</li>
            <li>Secure cloud infrastructure (Vercel/AWS)</li>
            <li>Regular security audits</li>
            <li>Immediate file deletion after processing</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Contact</h2>
          <p>Questions about privacy? Email us at privacy@svgai.org</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Updates</h2>
          <p>We'll notify registered users of any significant privacy policy changes via email.</p>
        </div>
      </section>
    </div>
  )
}