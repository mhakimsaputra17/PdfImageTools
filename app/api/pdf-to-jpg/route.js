const ILovePDFApi = require("@ilovepdf/ilovepdf-nodejs");
const ILovePDFFile = require("@ilovepdf/ilovepdf-nodejs/ILovePDFFile");
const fs = require("fs");
const path = require("path");
const { NextResponse } = require("next/server");
const JSZip = require("jszip");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const mergeAll = formData.get("mergePDF") === "true";
    const pdfFiles = [];
    for (const entry of formData.entries()) {
      if (entry[0] === "pdfFile") {
        pdfFiles.push(entry[1]);
      }
    }

    const instance = new ILovePDFApi(
      "project_public_973bc001c76cec9a83057c8b47ccf9d0_7V9XU0bade2ebe89c99cff289c9dd7aa30616",
      "secret_key_51c42c47c4494160648f9dd01a44a879_HDqtF302e8ff77576f0b5948d8437a3549a3b"
    );

    if (mergeAll) {
      // Satu task, semua file ditambahkan sekaligus → hasil unduhan satu ZIP
      const task = instance.newTask("pdfjpg");
      await task.start();
      for (const pdf of pdfFiles) {
        const buf = new Uint8Array(await pdf.arrayBuffer());
        await task.addFile(new ILovePDFFile(Buffer.from(buf), pdf.name));
      }
      await task.process();
      const data = await task.download();
      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Disposition": 'attachment; filename="converted_images.zip"',
          "Content-Type": "application/zip",
        },
      });
    } else {
      // Banyak task → unduh ZIP per file, lalu gabungkan result ke dalam satu ZIP baru
      const zip = new JSZip();
      for (let i = 0; i < pdfFiles.length; i++) {
        const pdf = pdfFiles[i];
        const buf = new Uint8Array(await pdf.arrayBuffer());
        const task = instance.newTask("pdfjpg");
        await task.start();
        await task.addFile(new ILovePDFFile(Buffer.from(buf), pdf.name));
        await task.process();
        const data = await task.download();
        zip.file(`converted_${i + 1}.zip`, data);
      }
      const finalZip = await zip.generateAsync({ type: "uint8array" });
      return new NextResponse(finalZip, {
        status: 200,
        headers: {
          "Content-Disposition": 'attachment; filename="all_converted.zip"',
          "Content-Type": "application/zip",
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
