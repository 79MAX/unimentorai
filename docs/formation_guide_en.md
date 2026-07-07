# Training Guide – UniMentorAI Teams

## 1. Admin Panel Overview
- Secure access (admin account required)
- View subscriptions and invoices (filter by segment, email, date)
- Direct access to PDF invoices
- Export subscriptions/invoices as CSV
- Delete a subscription/invoice (GDPR compliance)

## 2. Subscription/Invoice Management
- Check subscription status (paid, pending, cancelled)
- Remind a client (automatic or manual email)
- Generate a new invoice if needed (Cloud Function)
- Track payments (Stripe/Firebase Billing)

## 3. GDPR Export & Compliance
- Export all user data (export_rgpd.js script)
- Respond to export or deletion requests within 30 days (legal requirement)
- Delete data on request (admin panel or script)
- Keep a log of consents and exports

## 4. GDPR Best Practices
- Always obtain explicit consent before any subscription
- Never transmit personal data without encryption
- Use exports only to fulfill legal requests
- Document all deletions/exports in the GDPR log

## 5. Support & Security
- For technical issues, contact support@unimentor.ai
- Never share admin access without authorization
- Regularly change admin passwords
- Enable two-factor authentication on all sensitive accounts

## 6. Publication/Tender Process
- Prepare a folder with:
  - Exported pricing grid (PDF)
  - Signed CGU/GDPR
  - Sample invoices
  - Quality audit report (audit_report.md)
  - Platform presentation (PDF/PowerPoint)
- Use the simulator to generate custom quotes
- Export invoices and data on request for public/private tenders

## 7. FAQ
- **How to reset admin access?**
  Use the Firebase Auth console or contact support.
- **How to prove GDPR compliance?**
  Provide the consent log, exports, and audit report.
- **How to add a new segment/tier?**
  Edit the pricing JSON or use the admin panel (if available).

---

**This guide must be read and followed by anyone with access to the UniMentorAI admin panel or sensitive data.** 