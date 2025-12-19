import { prisma } from "@/lib/prisma";
import { CVDocument } from "@/components/pdf/CVDocument";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch data from database
    const [hero, contact, experience, skills] = await Promise.all([
      prisma.heroSection.findFirst(),
      prisma.contactInfo.findFirst(),
      prisma.experienceEntry.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.skill.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    // Create a stream for the PDF
    const stream = await renderToStream(
      <CVDocument 
        data={{
          hero,
          contact,
          experience,
          skills
        }} 
      />
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Uint8Array);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Angga_Ady_Pratama_CV.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    return NextResponse.json(
      { error: "Failed to generate CV" },
      { status: 500 }
    );
  }
}
