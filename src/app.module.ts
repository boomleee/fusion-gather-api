import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyModule } from './dummy/dummy.module';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { dataSourceOptions } from 'db/data-source';
import { MailerModule } from '@nestjs-modules/mailer';
import { BoothModule } from './booth/booth.module';
import { EventModule } from './event/event.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { ImageModule } from './image/image.module';
import { EventLocationModule } from './event-location/event-location.module';
import { BoothLocationModule } from './booth-location/booth-location.module';

@Module({
  imports: [
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
    BoothModule,
    EventModule,
    QrcodeModule,
    ImageModule,
    EventLocationModule,
    BoothLocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
