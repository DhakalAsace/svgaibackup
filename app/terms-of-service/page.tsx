import { Metadata } from 'next'
import { generateMetaTags, generateBreadcrumbSchema } from '@/lib/seo/technical-seo'

export const metadata: Metadata = generateMetaTags({
  title: 'Terms of Service | SVG AI',
  description: 'Terms and conditions for using SVG AI services',
  path: '/terms-of-service'
})

export default function TermsOfService() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://svgai.org' },
    { name: 'Terms of Service', url: 'https://svgai.org/terms-of-service' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SVG AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              SVG AI provides AI-powered SVG generation and conversion tools, including:
            </p>
            <ul>
              <li>AI icon and SVG generation</li>
              <li>Format conversion tools (PNG to SVG, SVG to PNG, etc.)</li>
              <li>SVG editing and optimization tools</li>
              <li>SVG animation tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use our services for illegal or unauthorized purposes</li>
              <li>Generate content that violates intellectual property rights</li>
              <li>Create harmful, offensive, or inappropriate content</li>
              <li>Attempt to bypass usage limits or security measures</li>
              <li>Interfere with or disrupt our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <h3 className="text-xl font-semibold mb-2">Your Content</h3>
            <p>
              You retain ownership of SVGs you create. By using our services, you grant us a limited license to process and display your content as necessary to provide our services.
            </p>
            <h3 className="text-xl font-semibold mb-2">Our Content</h3>
            <p>
              The SVG AI platform, including its design, features, and content (excluding user-generated content), is protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <p>For paid services:</p>
            <ul>
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Credits expire after 30 days</li>
              <li>Refunds are provided according to our refund policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimers</h2>
            <p>
              SVG AI is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul>
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or reliability of generated content</li>
              <li>That content will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SVG AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SVG AI from any claims, damages, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p>
              We may terminate or suspend your access to our services at any time for violation of these terms. You may cancel your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>
              For questions about these Terms of Service:
            </p>
            <ul>
              <li>Email: legal@svgai.org</li>
              <li>Website: https://svgai.org/contact</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}