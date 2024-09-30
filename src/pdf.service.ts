import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Injectable()
export class PdfService {
  generateInvoice(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const filename = `factura_${data.idPedido}.pdf`;
        const filePath = `./facturas/${filename}`;

        // Crear el directorio si no existe
        if (!fs.existsSync('./facturas')) {
          fs.mkdirSync('./facturas');
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Agregar contenido al PDF
        doc.fontSize(25).text('Factura', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Pedido ID: ${data.idPedido}`);
        doc.text(`Cliente: ${data.nombreCliente}`);
        doc.text(`Fecha: ${data.fecha}`);
        doc.moveDown();
        doc.text('Detalles del Pedido:');
        data.detalles.forEach((detalle) => {
          doc.text(
            `- ${detalle.producto}: ${detalle.cantidad} x ${detalle.precioUnitario} = ${detalle.total}`,
          );
        });
        doc.moveDown();
        doc.text(`Total: ${data.total}`, { align: 'right' });

        doc.end();

        stream.on('finish', () => {
          resolve(filePath);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
