import { Metadata } from 'next'
import { generateMetaTags, generateBreadcrumbSchema } from '@/lib/seo/technical-seo'

export const metadata: Metadata = generateMetaTags({
  title: 'Terms of Service | SVG AI',
  description: 'Terms and conditions for using SVG AI services. Free file converters, AI-powered SVG generation, and educational content.',
  path: '/terms'
})

export default function TermsOfService() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://svgai.org' },
    { name: 'Terms of Service', url: 'https://svgai.org/terms' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: January 22, 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
          <p>By using SVG AI ("we", "our", "us"), you agree to these Terms of Service. If you disagree, do not use our services.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. Age Requirements</h2>
          <p>You must be at least 13 years old to use our services. By using SVG AI, you represent that you meet this age requirement.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Services Provided</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Free Services</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>40+ file converters (browser-based processing)</li>
            <li>SVG editor and optimizer tools</li>
            <li>SVG animation tool</li>
            <li>6 free AI generation credits for new users</li>
            <li>Educational content and guides</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Paid Services</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI-powered SVG and icon generation (credit-based)</li>
            <li>SVG to video export (credit-based)</li>
            <li>Extended content retention (30 days for Pro vs 7 days)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Account Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate account information</li>
            <li>Maintain security of your credentials</li>
            <li>Notify us immediately of unauthorized access</li>
            <li>You are responsible for all activity under your account</li>
            <li>Do not share accounts or transfer credits</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">You agree NOT to:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Upload illegal, harmful, or infringing content</li>
            <li>Attempt to hack, overload, or damage our services</li>
            <li>Use automated tools without permission</li>
            <li>Resell access to our services or credits to others</li>
            <li>Generate content that violates others' rights</li>
            <li>Use our tools for spam or malicious purposes</li>
            <li>Circumvent usage limits or security measures</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Note: You CAN sell or use any files you convert or generate - they're yours!</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Your Content</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>You retain full ownership of all files you upload</li>
            <li>You grant us temporary license to process files for conversion only</li>
            <li>You're responsible for having rights to uploaded content</li>
            <li>Converted files are 100% yours - use them however you want</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">AI-Generated Content</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>You own all AI-generated SVGs and icons you create</li>
            <li>Use them commercially, sell them, include in client work - it's all allowed</li>
            <li>We don't claim any ownership of your generations</li>
            <li>Note: AI content may not be copyrightable in some jurisdictions</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Our Property</h3>
          <p>SVG AI owns all rights to our website, tools, and original content. Do not copy, modify, or distribute our proprietary materials.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Payment Terms</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Billing & Credits</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Subscriptions auto-renew until cancelled</li>
            <li>Credits refresh monthly on all plans (including annual)</li>
            <li>Unused credits expire - no rollover between months</li>
            <li>Credits cannot be transferred between accounts</li>
            <li>Stripe sends renewal reminders before each billing cycle</li>
            <li>View upcoming charges in Stripe portal (link in dashboard)</li>
            <li>Prices may change with 30 days notice</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Cancellation</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cancel anytime through Stripe customer portal</li>
            <li>Must cancel before renewal date to avoid next charge</li>
            <li>Keep access until end of current paid period</li>
            <li>Cancellation processed immediately by Stripe</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Refunds</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>14-day refund window (15 days for Quebec residents)</li>
            <li>Only if no credits have been used</li>
            <li>No partial period refunds</li>
            <li>Exceptions: billing errors or technical issues preventing access</li>
            <li>Request via hello@svgai.org within refund window</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Service Modifications</h2>
          <p>We may modify, suspend, or discontinue services at any time. We'll provide reasonable notice for significant changes affecting paid features.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">9. Account Termination</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">By You</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request account deletion at any time</li>
            <li>Email hello@svgai.org from registered email</li>
            <li>Subject: "Account Deletion Request"</li>
            <li>Processed within 30 days</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">By Us</h3>
          <p className="mb-2">We may terminate accounts that:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Violate these terms</li>
            <li>Engage in fraudulent activity</li>
            <li>Abuse our infrastructure</li>
            <li>Have payment failures</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Effect of Termination</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access ends immediately</li>
            <li>Unused monthly credits are forfeited (no rollover)</li>
            <li>Generated content may become inaccessible</li>
            <li>No refunds for partial billing periods</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">10. Disclaimers & Limitations</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Service Provided "As Is"</h3>
          <p>We provide our services without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free service.</p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Limitation of Liability</h3>
          <p className="mb-2">To the maximum extent permitted by law, we are not liable for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, data, or business opportunities</li>
            <li>File corruption or data loss</li>
            <li>Third-party actions or content</li>
          </ul>
          <p className="mt-2">Our total liability is limited to the amount you paid us in the last 12 months.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">11. Indemnification</h2>
          <p>You agree to indemnify and hold us harmless from claims arising from your use of our services, violation of these terms, or infringement of any rights.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">12. Governing Law</h2>
          <p>These terms are governed by the laws of Canada. Any disputes will be resolved in Canadian courts.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">13. DMCA Compliance</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Copyright Infringement</h3>
          <p className="mb-2">To report copyright infringement, send to hello@svgai.org:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Description of copyrighted work</li>
            <li>Location of infringing material</li>
            <li>Your contact information</li>
            <li>Good faith statement</li>
            <li>Accuracy statement under penalty of perjury</li>
            <li>Physical or electronic signature</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Counter-Notice</h3>
          <p>If you believe content was wrongly removed, you may file a counter-notice with similar requirements.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">14. Privacy</h2>
          <p>Your use of our services is subject to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which explains how we collect and use your data.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">15. Severability</h2>
          <p>If any part of these terms is found unenforceable, the remaining terms continue in effect.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">16. Entire Agreement</h2>
          <p>These terms constitute the entire agreement between you and SVG AI regarding our services.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">17. Changes to Terms</h2>
          <p>We may update these terms. Continued use after changes constitutes acceptance. We'll notify users of material changes.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">18. Contact Information</h2>
          <p><strong>Email:</strong> hello@svgai.org</p>
          <p><strong>Response Time:</strong> Within 2 business days for general inquiries</p>
        </div>
      </section>
    </div>
    </>
  )
}