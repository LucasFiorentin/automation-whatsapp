import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import * as qrcodeterminal from 'qrcode-terminal';
import * as path from 'path';
import { unlinkSync, rmdirSync } from 'fs';
import * as fs from 'fs';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private qrCode: string | null = null;
  private status: 'initializing' | 'ready' | 'disconnected';

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      this.status = 'initializing';
      this.qrCode = qr;
      qrcodeterminal.generate(qr, { small: true });
      this.logger.log('QR Code gerado');
    });

    this.client.on('ready', () => {
      this.status = 'ready';
      this.logger.log('WhatsApp conectado e pronto!');
    });

    this.client.on('disconnected', (reason) => {
      this.status = 'disconnected';
      this.logger.warn(`Desconectado do WhatsApp: ${reason}`);
      this.qrCode = null; 
    });
  }

  private deleteAuthFolder() {
    const authFolderPath = path.resolve(process.cwd(), '.wwebjs_auth');  
    this.logger.log('Tentando excluir a pasta:', authFolderPath);
    try {
      if (fs.existsSync(authFolderPath)) {
        fs.rmSync(authFolderPath, { recursive: true, force: true });
        this.logger.log('Pasta .wwebjs_auth excluída com sucesso!');
      } else {
        this.logger.warn('A pasta .wwebjs_auth não existe.');
      }
    } catch (error) {
      this.logger.error('Erro ao excluir a pasta .wwebjs_auth:', error.message);
    }
  }
  
  async logout() {
    await this.client.destroy();
    this.deleteAuthFolder()
    this.logger.log('Cliente WhatsApp desconectado!');
    this.qrCode = null;
    
    try {
      await this.client.initialize(); 
      this.logger.log('Cliente WhatsApp reconectado e pronto!');
      return { message: 'Desconectado com sucesso, por favor escaneie o novo QR Code' };
    } catch (error) {
      this.logger.error('Erro ao reconectar o WhatsApp:', error);
    }
  }

  async onModuleInit() {
    this.logger.log('Inicializando o cliente do WhatsApp...');
    try {
      await this.client.initialize();
      this.logger.log('Cliente WhatsApp inicializado com sucesso!');
    } catch (error) {
      this.logger.error('Erro ao inicializar o cliente WhatsApp:', error);
    }
  }

  async getQRCodeImage(): Promise<string | null> {
    if (this.qrCode) {
      return await qrcode.toDataURL(this.qrCode);
    }
    return null;
  }

  async getContactName(number: string) {
    const contact = await this.client.getContactById(number + '@c.us');
    if (contact) {
      return contact.pushname;
    }
    return null;
  }

  async sendMessage(number: string, message: string, name: string | boolean) {
    const formattedNumber = String(number).includes('@c.us')
      ? number
      : `${number}@c.us`;

    const contactName = await this.getContactName(number);
    if (name == true) {
      message = message.replace('{name}', contactName);
    }

    try {
      await this.client.sendMessage(formattedNumber, message);
      return 'Mensagem enviada com sucesso!';
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem', error);
      throw new Error('Erro ao enviar mensagem');
    }
  }

  async sendMedia(
    number: string,
    file: Express.Multer.File,
    caption?: string,
    name?: string | boolean,
  ): Promise<string> {
    const formattedNumber = String(number).includes('@c.us')
      ? number
      : `${number}@c.us`;

    const contactName = await this.getContactName(number);

    if (name == true) {
      caption = caption.replace('{name}', contactName);
    }

    try {
      const media = new MessageMedia(
        file.mimetype,
        file.buffer.toString('base64'),
        file.originalname,
      );

      await this.client.sendMessage(formattedNumber, media, { caption });

      return 'Mídia enviada com sucesso!';
    } catch (error) {
      this.logger.error('Erro ao enviar mídia', error);
      throw new Error('Erro ao enviar mídia');
    }
  }

  async sendAllMessages(
    type: 'media' | 'message',
    numbers: string[],
    message?: string,
    mediaFile?: Express.Multer.File,
    name?: string | boolean,
  ) {
    for (const number of numbers) {
      if (type === 'message') {
        await this.sendMessage(number, message!, name);
      } else if (type === 'media' && mediaFile) {
        await this.sendMedia(number, mediaFile, message, name);
      }

      const delay = Math.floor(Math.random() * 10000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  getStatus(): string {
    return this.status;
  }
}
