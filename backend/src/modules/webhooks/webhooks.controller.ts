import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhookService: WebhooksService) {}

  @Get()
  verifyWebhook(@Query() query: any, @Res() res: Response) {
    const response = this.webhookService.webhook(query);
    res.send(response); // Enviar el desafío de vuelta
  }

  // Ruta para recibir mensajes (POST)
  @Post()
  receiveMessages(@Req() req: Request, @Res() res: Response): void {
    this.webhookService.recibe(req, res);
  }
}
