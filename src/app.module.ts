import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfService } from './pdf.service';
import { FacturacionController } from './facturacion.controller';
import { EmailService } from './email.service';

@Module({
  imports: [],
  controllers: [AppController, FacturacionController],
  providers: [PdfService, EmailService, AppService],
})
export class AppModule {}
