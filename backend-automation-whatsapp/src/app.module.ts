import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
require('dotenv').config();
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WhatsappModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
