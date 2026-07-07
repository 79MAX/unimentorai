import puppeteer from "puppeteer";
import { certificateTemplate } from "./certificate.template.js";

/* =========================
   🏆 CERTIFICATE PDF ENGINE (PRODUCTION CORE)
   - optimized puppeteer lifecycle
   - memory safe
   - faster rendering
   - cloud-ready architecture
========================= */

export class CertificatePDF {

  /**
   * 🚀 GENERATE PDF CERTIFICATE
   */
  static async generate(data) {

    let browser = null;

    try {

      /* =========================
         🎨 GENERATE HTML
      ========================= */
      const html = certificateTemplate(data);

      /* =========================
         🚀 LAUNCH BROWSER (OPTIMIZED)
      ========================= */
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ]
      });

      const page = await browser.newPage();

      /* =========================
         ⚡ PERFORMANCE OPTIMIZATION
      ========================= */
      await page.setCacheEnabled(false);

      await page.setContent(html, {
        waitUntil: "domcontentloaded"
      });

      /* =========================
         🧾 PDF GENERATION (PRO QUALITY)
      ========================= */
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px"
        }
      });

      return pdf;

    } catch (err) {

      console.error("[CERTIFICATE_PDF_ERROR]", err.message);

      throw new Error("PDF generation failed");

    } finally {

      /* =========================
         🧹 MEMORY CLEANUP (IMPORTANT)
      ========================= */
      if (browser) {
        await browser.close();
      }
    }
  }
}
