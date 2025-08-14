import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { RequestsModule } from './modules/requests/requests.module';
import { UsersModule } from './modules/users/users.module';
import { GammaModule } from './modules/gamma/gamma.module';
import { TransmissionModule } from './modules/transmission/transmission.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GlobalModule } from './core/global.module';
import { CitiesModule } from './modules/cities/cities.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { QuotesService } from './modules/quotes/quotes.service';
import { QuotesController } from './modules/quotes/quotes.controller';
import { QuotesModule } from './modules/quotes/quotes.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { AnswersModule } from './modules/answers/answers.module';
import { BrandsModule } from './modules/brands/brands.module';
import { FuelsModule } from './modules/fuels/fuels.module';
import { CountriesModule } from './modules/countries/countries.module';
import { GlobalCitiesModule } from './modules/global-cities/global-cities.module';
import { StatesModule } from './modules/states/states.module';
import { RequestsProvidersModule } from './modules/requests_providers/requests_providers.module';
import { GeolocationsModule } from './modules/geolocations/geolocations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('MAIL_FROM_NAME')}" <${config.get('MAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: __dirname + '/core/mail-templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    GlobalModule,
    AuthModule,
    RequestsModule,
    UsersModule,
    GammaModule,
    TransmissionModule,
    CitiesModule,
    QuotesModule,
    WebhooksModule,
    CustomersModule,
    ProvidersModule,
    AnswersModule,
    BrandsModule,
    FuelsModule,
    CountriesModule,
    GlobalCitiesModule,
    StatesModule,
    RequestsProvidersModule,
    GeolocationsModule,
  ],
  controllers: [AppController, QuotesController],
  providers: [AppService, QuotesService],
})
export class AppModule {}
