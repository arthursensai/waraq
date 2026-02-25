"use client";

import { pdfDocumentSchema } from "@/types/interfaces";
import PdfCard from "./pdf-card";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

interface PdfsSectionProps {
  pdfs: pdfDocumentSchema[];
  refetch: () => void;
}

const PdfsSection = ({ pdfs, refetch }: PdfsSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {pdfs.map((pdf, i) => (
        <div
          className="aspect-[3/4] w-full flex flex-col border-accent border-2 hover:bg-accent transition-all rounded-lg overflow-hidden cursor-pointer"
          key={i}
        >
          <div className="flex-1 relative bg-muted/20">
            {pdf.cover_url ? (
              <Image
                src={pdf.cover_url}
                alt={pdf.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <h1 className="text-center text-sm sm:text-base font-medium line-clamp-4">
                  {pdf.title}
                </h1>
              </div>
            )}
          </div>
          <div className="p-2 bg-background border-t border-accent flex gap-2 items-center ">
            <Button className="flex-1 flex" size="lg">
              <Link href={`/dashboard/${pdf.file_id}`} className="w-full">Read it</Link>
            </Button>
            <PdfCard key={pdf.file_id} pdf={pdf} refetchBooks={refetch} />
          </div>
        </div>
      ))}
      {pdfs.length === 0 && (
        <>
          <h1>You don't have any document</h1>
          <p>
            start by uploading from
            <Button variant="link">
              <Link href="/dasboard/addNew">here</Link>
            </Button>
          </p>
        </>
      )}
    </div>
  );
};

export default PdfsSection;
