// src/config/swagger.config.ts

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Zizicar')
        .setDescription('Endpoints para la aplicación de Zizicar')
        .setVersion('1.0')
        .addTag('zizicar')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config, {
        operationIdFactory: (
            controllerKey: string,
            methodKey: string
        ) => methodKey,
        ignoreGlobalPrefix: false,
    });

    SwaggerModule.setup('docs', app, document);
}