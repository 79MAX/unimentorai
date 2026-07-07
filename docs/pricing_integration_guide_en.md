# Integration Guide – UniMentorAI Subscription & Billing

## 1. General Architecture

- **Flutter**: Subscription UI, simulator, Stripe payment, dynamic breakdown, CGU/GDPR validation
- **Cloud Functions Node.js**: PDF invoice generation, Firebase Storage, Firestore logging, email sending, Stripe payment verification
- **Firestore**: Subscription and invoice tracking

## 2. Setup & Deployment

### Prerequisites
- Firebase account (Firestore, Storage, Functions enabled)
- Stripe account (API keys)
- SendGrid account (API key for emailing)
- Flutter 3.22+, Node.js 18+, npm

### Backend Deployment
1. Clone the repo and install dependencies in `functions/`:
   ```bash
   cd functions
   npm install
   ```
2. Set environment variables:
   - `STRIPE_SECRET_KEY` (Stripe secret key)
   - `SENDGRID_API_KEY` (SendGrid API key)
   - `GCLOUD_STORAGE_BUCKET` (Firebase Storage bucket name)
3. Deploy the Cloud Function:
   ```bash
   firebase deploy --only functions
   ```

### Flutter Deployment
1. Install dependencies:
   ```bash
   flutter pub get
   ```
2. Set the Cloud Function URLs in `billing_screen.dart`
3. Add Stripe keys to the Flutter project (`flutter_stripe`)
4. Run the app:
   ```bash
   flutter run
   ```

## 3. Customization
- Edit the pricing grid in `lib/core/constants/pricing_config.json` or via Firestore
- Adapt email templates (SendGrid)
- Add options or extra services in the JSON
- Customize the PDF (logo, legal mentions, etc.)

## 4. GDPR & Compliance
- Explicit CGU/GDPR consent required before payment
- Invoices securely stored (Firebase Storage)
- Data export/deletion on request (admin panel or script)
- Access and action logs in Firestore

## 5. Testing & Quality
- Unit, widget, integration, and accessibility tests provided (`test/features/pricing/`)
- CI/CD recommended (GitHub Actions, see `.github/workflows/`)
- Automated GDPR and accessibility audits possible

## 6. FAQ
- **How to change the currency?**
  Edit the `currencies` field in the pricing JSON and adapt Stripe.
- **How to add a segment or offer?**
  Add an entry in the JSON or Firestore, then restart the app.
- **How to customize the PDF?**
  Edit the Cloud Function in `functions/generate_invoice.js`.
- **How to export all invoices?**
  Use Firebase Storage or an export script.
- **How to ensure GDPR compliance?**
  Enable export/deletion on request, keep a consent log.

## 7. Support
- Contact: support@unimentor.ai
- Technical documentation: [https://unimentor.ai/docs](https://unimentor.ai/docs) 