const PDFDocument = require("pdfkit");

module.exports = function generateCertificate(name) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(30).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(20).text(`This certifies that`, { align: "center" });
    doc.moveDown();
    doc.fontSize(26).text(name, { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text("has successfully completed the course.", {
      align: "center",
    });

    doc.end();
  });
};
