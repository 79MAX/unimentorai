# Admin & User Guide – UniMentorAI Certificates

## Table of Contents
- [1. Certificate Generation (User)](#1-certificate-generation-user)
- [2. Certificate Verification (Third Party)](#2-certificate-verification-third-party)
- [3. CSV Export of Certificates (Admin)](#3-csv-export-of-certificates-admin)
- [4. CI/CD Automation](#4-cicd-automation)
- [5. Accessibility & Best Practices](#5-accessibility--best-practices)

---

## 1. Certificate Generation (User)
- The user completes a course in the app.
- They click **“Generate my certificate”**.
- The certificate is created in Firestore, a unique QR code is generated.
- The user can view, download, or print their certificate (PDF with QR code, logo, signature).

## 2. Certificate Verification (Third Party)
- Scan the certificate’s QR code (or open the link).
- The verification web page opens and displays:
  - Name, course, date, status, “Verified” badge, QR code.
  - Guaranteed accessibility (contrast, ARIA, responsive).

## 3. CSV Export of Certificates (Admin)
- Connect to the Node.js server.
- Access the URL:
  - `http://localhost:3000/certs/export`
  - or `https://unimentorai.com/certs/export`
- Download the `certificats.csv` file containing: ID, name, course, date, status.

## 4. CI/CD Automation
- A GitHub Actions workflow (`.github/workflows/certificat-ci.yml`) automates:
  - Flutter tests (widget + integration) for the certificate feature.
  - Automatic CSV export after each push.
- To trigger manually:
  - Push a change to the main branch or to any certificate-related file.
  - The CSV is generated and downloadable in the workflow artifacts.

## 5. Accessibility & Best Practices
- The verification page is accessible (ARIA tags, contrast, responsive, keyboard navigation).
- The certificate PDF is readable, printable, and compatible with screen readers.
- The QR code enables instant, tamper-proof verification.

---

## FAQ
- **How do I add a logo?**
  - Place your logo in `assets/logo.png` and declare it in `pubspec.yaml`.
- **How do I customize the signature?**
  - Edit the `createCertificatePdf` function to use a signature image.
- **How do I manually add a certificate?**
  - Add a document to the `certificates` collection in Firestore with the required fields.
- **How do I revoke a certificate?**
  - Change the `status` field to `revoked` in Firestore.

---

For any questions, contact the UniMentorAI team or open an issue on GitHub. 

## Table of Contents
- [1. Certificate Generation (User)](#1-certificate-generation-user)
- [2. Certificate Verification (Third Party)](#2-certificate-verification-third-party)
- [3. CSV Export of Certificates (Admin)](#3-csv-export-of-certificates-admin)
- [4. CI/CD Automation](#4-cicd-automation)
- [5. Accessibility & Best Practices](#5-accessibility--best-practices)

---

## 1. Certificate Generation (User)
- The user completes a course in the app.
- They click **“Generate my certificate”**.
- The certificate is created in Firestore, a unique QR code is generated.
- The user can view, download, or print their certificate (PDF with QR code, logo, signature).

## 2. Certificate Verification (Third Party)
- Scan the certificate’s QR code (or open the link).
- The verification web page opens and displays:
  - Name, course, date, status, “Verified” badge, QR code.
  - Guaranteed accessibility (contrast, ARIA, responsive).

## 3. CSV Export of Certificates (Admin)
- Connect to the Node.js server.
- Access the URL:
  - `http://localhost:3000/certs/export`
  - or `https://unimentorai.com/certs/export`
- Download the `certificats.csv` file containing: ID, name, course, date, status.

## 4. CI/CD Automation
- A GitHub Actions workflow (`.github/workflows/certificat-ci.yml`) automates:
  - Flutter tests (widget + integration) for the certificate feature.
  - Automatic CSV export after each push.
- To trigger manually:
  - Push a change to the main branch or to any certificate-related file.
  - The CSV is generated and downloadable in the workflow artifacts.

## 5. Accessibility & Best Practices
- The verification page is accessible (ARIA tags, contrast, responsive, keyboard navigation).
- The certificate PDF is readable, printable, and compatible with screen readers.
- The QR code enables instant, tamper-proof verification.

---

## FAQ
- **How do I add a logo?**
  - Place your logo in `assets/logo.png` and declare it in `pubspec.yaml`.
- **How do I customize the signature?**
  - Edit the `createCertificatePdf` function to use a signature image.
- **How do I manually add a certificate?**
  - Add a document to the `certificates` collection in Firestore with the required fields.
- **How do I revoke a certificate?**
  - Change the `status` field to `revoked` in Firestore.

---

For any questions, contact the UniMentorAI team or open an issue on GitHub. 
 