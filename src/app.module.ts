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


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
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
    // HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
