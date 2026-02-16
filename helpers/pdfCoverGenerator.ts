import * as pdfjsLib from "pdfjs-dist/build/pdf.js";
import { createCanvas } from "canvas";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    require("pdfjs-dist/build/pdf.worker.js");

export const generatePdfCover = async (pdfUrl: string) => {
    const res = await fetch(pdfUrl);
    const buffer = await res.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.4 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    await page.render({
        canvasContext: context,
        viewport,
    }).promise;

    return canvas.toBuffer("image/jpeg");
};

export const runtime = "nodejs";
