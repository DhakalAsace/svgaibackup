import { Metadata } from 'next'
import { generateMetaTags, generateBreadcrumbSchema } from '@/lib/seo/technical-seo'

export const metadata: Metadata = generateMetaTags({
  title: 'Privacy Policy | SVG AI',
  description: 'Learn how SVG AI protects your privacy. Most converters work in your browser - files never leave your device. Enterprise-grade security for server processing.',
  path: '/privacy'
})

export default function PrivacyPolicy() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://svgai.org' },
    { name: 'Privacy Policy', url: 'https://svgai.org/privacy' }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: January 22, 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Who We Are</h2>
          <p className="mb-2">SVG AI is a file conversion and AI generation service operated from Canada.</p>
          <p><strong>Privacy Contact:</strong> hello@svgai.org</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. What Data We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Account Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email address (required)</li>
            <li>Name (optional)</li>
            <li>Authentication data (encrypted)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Service Usage</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Files you upload for conversion (deleted immediately after processing)</li>
            <li>AI-generated content you create</li>
            <li>Converter usage statistics (anonymous)</li>
            <li>Performance metrics (page load times, errors)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Payment Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Stripe customer ID</li>
            <li>Subscription status</li>
            <li>Credit usage</li>
            <li>We never see your credit card details (handled by Stripe)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Legal Basis for Processing (GDPR)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Contract:</strong> To provide our services to you</li>
            <li><strong>Consent:</strong> For marketing communications (optional)</li>
            <li><strong>Legitimate Interest:</strong> For security and fraud prevention</li>
            <li><strong>Legal Obligation:</strong> To comply with laws and regulations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide file conversion services</li>
            <li>Process AI generation requests</li>
            <li>Manage your account and subscription</li>
            <li>Send service-related communications</li>
            <li>Improve our services and fix issues</li>
            <li>Prevent fraud and abuse</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. File Processing Details</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Browser-Based Converters (Most Tools)</h3>
          <p className="mb-2">These converters process files entirely in your browser:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>PNG ↔ SVG, JPG ↔ SVG, WebP ↔ SVG</li>
            <li>SVG to PNG/JPG/PDF/ICO</li>
            <li>Files never leave your device</li>
            <li>Zero server storage</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Server-Based Processing (Complex Formats)</h3>
          <p className="mb-2">These formats require temporary server processing:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI, EPS, EMF, WMF, AVIF formats</li>
            <li>SVG to GIF/Video conversion</li>
            <li>Files encrypted during transfer (HTTPS)</li>
            <li>Processed and deleted immediately</li>
            <li>No permanent storage or backups</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Uploaded files:</strong> Deleted immediately after conversion</li>
            <li><strong>Account data:</strong> Until you request deletion</li>
            <li><strong>AI-generated content (SVGs, icons, videos):</strong> 7 days (Free/Starter) or 30 days (Pro)</li>
            <li><strong>Payment records:</strong> As required by tax laws (7 years)</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Note: Generated content is automatically deleted after the retention period. Download your creations to keep them permanently.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. Third-Party Service Providers</h2>
          <p className="mb-2">We share data only with essential service providers for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Infrastructure & Hosting:</strong> Cloud database, authentication, and web hosting services</li>
            <li><strong>Payment Processing:</strong> Secure payment gateway (Stripe, Inc.)</li>
            <li><strong>AI Processing:</strong> Machine learning model infrastructure</li>
            <li><strong>Analytics:</strong> Anonymous usage statistics and performance monitoring</li>
          </ul>
          <p className="mt-2">We never sell or rent your personal data to third parties.</p>
          <p className="mt-2 text-sm text-gray-600">For California residents: Specific third-party recipients include Stripe for payments and our cloud infrastructure providers. Full list available upon request.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Your Privacy Rights</h2>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Under GDPR/CCPA/PIPEDA</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Erasure:</strong> Delete your account and data</li>
            <li><strong>Portability:</strong> Export your data</li>
            <li><strong>Object:</strong> Opt-out of certain processing</li>
            <li><strong>Withdraw Consent:</strong> Unsubscribe from marketing emails via link in email</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">How to Exercise Your Rights</h3>
          <p className="mb-2">Email hello@svgai.org with your request. We'll respond within:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>30 days (GDPR/PIPEDA)</li>
            <li>45 days (CCPA) with possible 45-day extension</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Account Deletion Process</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Email hello@svgai.org from your registered email</li>
            <li>Subject: "Account Deletion Request"</li>
            <li>We'll verify your identity</li>
            <li>Delete your data within 30 days</li>
            <li>Send confirmation when complete</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">Note: We may retain some data for legal compliance or fraud prevention.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">9. International Data Transfers</h2>
          <p className="mb-2">Your data may be processed in:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>United States (primary data center)</li>
            <li>Canada (business operations)</li>
          </ul>
          <p className="mt-2">We ensure appropriate safeguards through our service providers' compliance with privacy frameworks.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">10. Security Measures</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>HTTPS encryption for all data transfers</li>
            <li>Encrypted database storage</li>
            <li>Secure authentication (bcrypt hashing)</li>
            <li>Row-level security policies</li>
            <li>Regular security updates</li>
            <li>Immediate deletion of processed files</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">11. Children's Privacy</h2>
          <p className="mb-2">Our service is not intended for children under 13. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">12. Cookies & Tracking</h2>
          <p className="mb-2">We use minimal cookies for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Authentication:</strong> To keep you logged in</li>
            <li><strong>Security:</strong> To prevent fraud</li>
            <li><strong>Analytics:</strong> Anonymous usage statistics (Vercel)</li>
          </ul>
          <p className="mt-2">We do not use tracking cookies or third-party advertising cookies.</p>
          <p className="mt-2"><strong>Do Not Track:</strong> We respect browser DNT signals by not using tracking cookies.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">13. Marketing Communications</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Service updates and important notices (always sent)</li>
            <li>Marketing emails only with your consent</li>
            <li>One-click unsubscribe link in every marketing email</li>
            <li>Unsubscribe requests processed within 10 days</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600">Note: You cannot opt out of transactional emails (password resets, payment confirmations, etc.)</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">14. California Privacy Rights</h2>
          <p className="mb-2">California residents have additional rights under CCPA:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>We do not sell or share personal information</li>
            <li>No "Do Not Sell or Share" link needed</li>
            <li>Right to know categories of data collected</li>
            <li>Right to non-discrimination for exercising rights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">15. Complaints</h2>
          <p className="mb-2">If you have privacy concerns:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Contact us at hello@svgai.org</li>
            <li>If unresolved, you may lodge a complaint with:
              <ul className="list-disc pl-6 mt-2">
                <li>Your local data protection authority (EU)</li>
                <li>Office of the Privacy Commissioner of Canada</li>
                <li>California Attorney General (CCPA)</li>
              </ul>
            </li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">16. Changes to This Policy</h2>
          <p>We'll notify registered users by email of material changes. Continued use after changes constitutes acceptance.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">17. Contact Information</h2>
          <p><strong>Email:</strong> hello@svgai.org</p>
          <p><strong>Response Time:</strong> Within 30 days (or 45 days for CCPA requests)</p>
        </div>
      </section>
    </div>
    </>
  )
}