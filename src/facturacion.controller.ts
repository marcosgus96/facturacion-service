import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PdfService } from './pdf.service';
import { EmailService } from './email.service';

@Controller()
export class FacturacionController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
  ) {}

  @EventPattern('pedido_creado')
  async handlePedidoCreado(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Generar PDF
      const pdfPath = await this.pdfService.generateInvoice(data);

      // Enviar correo electrónico con el PDF adjunto
      await this.emailService.sendInvoice(
        data.emailCliente,
        `Factura de tu pedido #${data.idPedido}`,
        'Adjunto encontrarás la factura de tu pedido.',
        pdfPath,
      );

      // Confirmar que el mensaje fue procesado
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      // En caso de error, podrías decidir no confirmar el mensaje para que RabbitMQ lo reintente
      // O puedes confirmar el mensaje y registrar el error
      channel.ack(originalMsg);
    }
  }
}
