'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-black-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Privacy Policy</h1>

        <p className="mb-4 text-sm text-gray-400">
            Last updated: August 7, 2025
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-white">Data Privacy & Security</h2>
        <p className="mb-4">
            NovelPedia is committed to protecting user data and ensuring compliance with global privacy laws while maintaining a secure and transparent platform. User privacy is a top priority, and NovelPedia never sells personal data to third parties.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">1.1 User Data Protection & Privacy Compliance</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Complies with GDPR (EU), CCPA (US), and other relevant privacy laws</li>
            <li>Does not sell user data</li>
            <li>Only collects personal data for essential operations (e.g., account, security, payments)</li>
            <li>Allows users to view, modify, or delete their data upon request</li>
            <li>Encrypts and stores sensitive data securely</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">1.2 How We Collect & Use Data</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Collected: email, IP, device ID, activity logs, payment metadata</li>
            <li>Used for: account verification, fraud prevention, platform improvement, anonymous analytics</li>
            <li>Payment processing is handled by trusted third-party services (e.g., PayPal, Stripe)</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">1.3 Account Deletion & Data Removal</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Users can request account deletion</li>
            <li>Some data may be retained for legal/tax reasons</li>
            <li>Purchased content remains accessible unless refunded</li>
            <li>Deletion requests processed within 30 days</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">1.4 Third-Party Integrations</h3>
        <p className="mb-4">
            NovelPedia integrates with third-party providers such as payment processors (e.g., PayPal, Stripe), login providers (e.g., Google, Apple), and analytics platforms. These services operate under their own privacy policies. We only share essential data for platform functionality and security.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Children’s Privacy</h3>
        <p className="mb-4">
            Our service does not target children under 13. We do not knowingly collect data from children. Parents may contact us to remove any such data if it exists.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Links to Other Websites</h3>
        <p className="mb-4">
            Our service may contain links to third-party sites. We are not responsible for their content or privacy practices. Please review their privacy policies individually.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Changes to this Policy</h3>
        <p className="mb-4">
            We may update this Privacy Policy periodically. Changes will be posted on this page and communicated via email or notice. Please review this page regularly.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Contact Us</h3>
        <p className="mb-2">If you have any questions about this Privacy Policy, contact us at:</p>
        <a href="mailto:admin@novelpedia.com"
            className="text-violet-700 font-medium underline hover:text-violet-300 transition">
            admin@novelpedia.com
        </a>
    </div>
  );
}
