import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyModule } from './dummy/dummy.module';
import { join } from 'path';
import { Dummy } from './dummy/entities/dummy.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Dummy],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DummyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
