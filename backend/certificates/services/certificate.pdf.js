import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * CERTIFICATE PDF V2
 * - professional layout
 * - african-inspired design support
 * - QR + hash embedded
 * - SaaS production ready
 */

export async function generateCertificatePDF(data) {
  return new Promise((resolve, reject) => {
    try {
      const {
        userName,
        courseName,
        certificateId,
        hash,
        qrCode,
        issuedAt,
      } = data;

      // 📄 Create PDF document
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50,
      });

      const fileName = `certificate-${certificateId}.pdf`;
      const filePath = path.join("storage", "certificates", fileName);

      // Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // =========================
      // 🎨 BACKGROUND DESIGN
      // =========================
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f7f3e9");

      // 🟡 Border (African gold style)
      doc
        .lineWidth(6)
        .strokeColor("#c9a227")
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .stroke();

      // =========================
      // 🏛 HEADER
      // =========================
      doc
        .fontSize(28)
        .fillColor("#1a1a1a")
        .text("CERTIFICATE OF COMPLETION", {
          align: "center",
        });

      doc.moveDown(2);

      // =========================
      // 🧑 USER NAME
      // =========================
      doc
        .fontSize(22)
        .fillColor("#000")
        .text(userName, {
          align: "center",
          underline: true,
        });

      doc.moveDown(1);

      // =========================
      // 📚 COURSE
      // =========================
      doc
        .fontSize(16)
        .fillColor("#333")
        .text(`has successfully completed the course`, {
          align: "center",
        });

      doc.moveDown(0.5);

      doc
        .fontSize(20)
        .fillColor("#1a1a1a")
        .text(courseName, {
          align: "center",
        });

      doc.moveDown(2);

      // =========================
      // 🔐 CERTIFICATE ID + HASH
      // =========================
      doc
        .fontSize(10)
        .fillColor("#555")
        .text(`Certificate ID: ${certificateId}`, {
          align: "left",
        });

      doc.text(`Hash: ${hash}`, {
        align: "left",
      });

      doc.text(
        `Issued At: ${new Date(issuedAt || Date.now()).toISOString()}`,
        {
          align: "left",
        }
      );

      // =========================
      // 📱 QR CODE
      // =========================
      if (qrCode) {
        const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
        const qrBuffer = Buffer.from(base64Data, "base64");

        doc.image(qrBuffer, doc.page.width - 180, doc.page.height - 180, {
          width: 120,
          height: 120,
        });
      }

      // =========================
      // 🖋 FOOTER BRANDING
      // =========================
      doc
        .fontSize(12)
        .fillColor("#c9a227")
        .text("UniMentorAI • Learn. Build. Transform Africa.", 0, doc.page.height - 60, {
          align: "center",
        });

      // Finish PDF
      doc.end();

      stream.on("finish", () => {
        resolve(filePath);
      });
    } catch (error) {
      reject(error);
    }
  });
}
