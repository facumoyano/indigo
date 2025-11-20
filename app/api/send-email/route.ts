import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailAttachment {
  filename: string;
  content: Buffer;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const nombre = formData.get('nombre') as string;
    const apellido = formData.get('apellido') as string;
    const formType = formData.get('formType') as string;
    const files = formData.getAll('files') as File[];

    // Convertir archivos a base64 para Resend
    const attachments: EmailAttachment[] = await Promise.all(
      files.map(async (file: File) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        return {
          filename: file.name,
          content: buffer,
        };
      })
    );

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambia esto por tu dominio verificado
      to: ['tu-email@ejemplo.com'], // Tu email de destino
      subject: `Nuevo ${formType} recibido`,
      html: `
        <h2>Nuevo formulario recibido</h2>
        <p><strong>Tipo:</strong> ${formType}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Apellido:</strong> ${apellido}</p>
        <p><strong>Archivos adjuntos:</strong> ${files.length}</p>
      `,
      attachments: attachments,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el formulario' },
      { status: 500 }
    );
  }
}