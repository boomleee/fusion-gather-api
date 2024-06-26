/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyModule } from './dummy/dummy.module';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from 'db/data-source';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { CategoryModule } from './category/category.module';
import { TicketModule } from './ticket/ticket.module';
import { BoothModule } from './booth/booth.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { ImageModule } from './image/image.module';
import { FolloweventModule } from './followevent/followevent.module';
import { RegisterboothModule } from './registerbooth/registerbooth.module';
import { PaymentModule } from './payment/payment.module';
import { WebhookModule } from './webhook/webhook.module';
import { BoothvisitorModule } from './boothvisitor/boothvisitor.module';
import * as Joi from '@hapi/joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        STRIPE_WEBHOOK_SECRET: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: 'fusiongather9@gmail.com',
            pass: 'njpxclvmemagfeec',
          },
        },
        defaults: {
          from: 'No Reply',
        },
      }),
      inject: [],
    }),
    DummyModule,
    AccountModule,
    UserModule,
    EventModule,
    CategoryModule,
    TicketModule,
    BoothModule,
    QrcodeModule,
    ImageModule,
    FolloweventModule,
    RegisterboothModule,
    PaymentModule,
    WebhookModule,
    BoothvisitorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
