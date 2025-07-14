import { Metadata } from 'next'
import { generateMetaTags, generateBreadcrumbSchema } from '@/lib/seo/technical-seo'

export const metadata: Metadata = generateMetaTags({
  title: 'Privacy Policy | SVG AI',
  description: 'Learn how SVG AI collects, uses, and protects your personal information',
  path: '/privacy-policy'
})

export default function PrivacyPolicy() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://svgai.org' },
    { name: 'Privacy Policy', url: 'https://svgai.org/privacy-policy' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as:</p>
            <ul>
              <li>Account information (email, name) when you sign up</li>
              <li>Payment information processed securely through Stripe</li>
              <li>SVG content you create or convert using our tools</li>
              <li>Usage data and analytics to improve our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns and trends</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>SSL/TLS encryption for all data transmissions</li>
              <li>Secure storage of data in encrypted databases</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
            </p>
            <ul>
              <li>Account data: Until account deletion</li>
              <li>Generated SVGs: 30 days for free users, indefinitely for paid users</li>
              <li>Analytics data: 2 years</li>
              <li>Payment records: As required by law (typically 7 years)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul>
              <li>Maintain your session and preferences</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Personalize your experience</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Note that disabling cookies may limit functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p>We work with trusted third-party services:</p>
            <ul>
              <li><strong>Stripe:</strong> Payment processing (PCI compliant)</li>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Vercel Analytics:</strong> Privacy-focused analytics</li>
              <li><strong>Replicate:</strong> AI model hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@svgai.org
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes by email or through our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>Email: privacy@svgai.org</li>
              <li>Website: https://svgai.org/contact</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}