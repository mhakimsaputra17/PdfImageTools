import { NextResponse } from 'next/server';
import { PDFDocument, PageSizes } from 'pdf-lib';
import JSZip from 'jszip';

// Fungsi untuk menangani request POST
export async function POST(request) {
    try {
        // 1) Parse incoming form data (images + merge setting).
        const formData = await request.formData();
        const mergeAll = formData.get('mergePDF') === 'true';
        const fileEntries = [];
        for (const entry of formData.entries()) {
            if (entry[0] === 'images') { // 'images' digunakan untuk file input
                fileEntries.push(entry[1]);
            }
        }

        // 2) Jika mergeAll true, buat satu PDF dengan banyak halaman.
        if (mergeAll) {
            const mergedPdf = await PDFDocument.create();
            for (const imgFile of fileEntries) {
                const bytes = new Uint8Array(await imgFile.arrayBuffer());
                const imagePdf = await PDFDocument.create();
                const page = imagePdf.addPage(PageSizes.A4);
                const { width, height } = page.getSize();
                const jpgImage = await imagePdf.embedJpg(bytes);
                let dims = jpgImage.scale(1);
                if (dims.width > width || dims.height > height) {
                    dims = jpgImage.scaleToFit(width, height);
                }
                page.drawImage(jpgImage, {
                    x: (width - dims.width) / 2,
                    y: (height - dims.height) / 2,
                    width: dims.width,
                    height: dims.height
                });
                const [mergedPage] = await mergedPdf.copyPages(imagePdf, [0]);
                mergedPdf.addPage(mergedPage);
            }
            const pdfBytes = await mergedPdf.save();
            return new NextResponse(pdfBytes, {
                status: 200,
                headers: { 'Content-Type': 'application/pdf' },
            });
        }

        // 3) Jika tidak merge, buat satu PDF per gambar, zip, dan kembalikan ZIP.
        const zip = new JSZip();
        for (let i = 0; i < fileEntries.length; i++) {
            const bytes = new Uint8Array(await fileEntries[i].arrayBuffer());
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage(PageSizes.A4);
            const { width, height } = page.getSize();
            const jpgImage = await pdfDoc.embedJpg(bytes);
            let dims = jpgImage.scale(1);
            if (dims.width > width || dims.height > height) {
                dims = jpgImage.scaleToFit(width, height);
            }
            page.drawImage(jpgImage, {
                x: (width - dims.width) / 2,
                y: (height - dims.height) / 2,
                width: dims.width,
                height: dims.height
            });
            const pdfBytes = await pdfDoc.save();
            zip.file(`image_${i + 1}.pdf`, pdfBytes);
        }
        const zipBytes = await zip.generateAsync({ type: 'uint8array' });
        return new NextResponse(zipBytes, {
            status: 200,
            headers: { 'Content-Disposition': 'attachment; filename="files.zip"', 'Content-Type': 'application/zip' },
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}