import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as xlsx from 'xlsx';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('qr-code')
  async getQRCode() {
    const qrCodeImage = await this.whatsappService.getQRCodeImage();

    if (qrCodeImage) {
      return { qrCode: qrCodeImage };
    } else {
      return { message: 'QR Code ainda não gerado ou erro no processo.' };
    }
  }

  @Get('status')
  getStatus() {
    return this.whatsappService.getStatus();
  }

  @Post('send-message')
  async sendMessage(
    @Body() body: { number: string; message: string; name: string | boolean },
  ) {
    if (!body.number || !body.message) {
      throw new BadRequestException('Número e mensagem são obrigatórios!');
    }

    if (body.name !== undefined) {
      body.name = body.name === 'true';
    }

    return this.whatsappService.sendMessage(
      body.number,
      body.message,
      body.name,
    );
  }

  @Post('send-media')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async sendMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { number: string; caption?: string; name: string | boolean },
  ) {
    if (!body.number || !file) {
      throw new BadRequestException('Número e arquivo são obrigatórios!');
    }

    if (body.name !== undefined) {
      body.name = body.name === 'true';
    }

    return this.whatsappService.sendMedia(
      body.number,
      file,
      body.caption,
      body.name,
    );
  }

  @Post('send-messages-text')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async sendMessagesFromExcelText(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      message: string;
      name: string | boolean;
      startDelay: number;
      endDelay: number;
    },
  ) {
    if (!file) {
      throw new BadRequestException('O arquivo Excel é obrigatório!');
    }
    if (!body.message) {
      throw new BadRequestException('A mensagem de texto é obrigatória!');
    }

    if (body.name !== undefined) {
      body.name = body.name === 'true';
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    const numbers = data.map((number) => number['Número']);
    const formattedNumbers = numbers.map((number) => {
      number = String(number);

      if (number.length > 12) {
        number = number.slice(0, 5) + number.slice(6);
      }

      return number;
    });

    if (data.length === 0 || !data[0].hasOwnProperty('Número')) {
      throw new BadRequestException(
        'O arquivo Excel deve conter uma coluna chamada "Número"',
      );
    }

    await this.whatsappService.sendAllMessages(
      'message',
      formattedNumbers,
      body.startDelay,
      body.endDelay,
      body.message,
      file,
      body.name,
    );
  }

  @Post('send-messages-media-text')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file' }, { name: 'image' }], {
      storage: memoryStorage(),
    }),
  )
  async sendMessagesFromExcelMediaAndText(
    @UploadedFiles()
    files: { file?: Express.Multer.File[]; image?: Express.Multer.File[] },
    @Body()
    body: {
      message: string;
      name: string | boolean;
      startDelay: number;
      endDelay: number;
    },
  ) {
    if (!files?.file || !files?.image) {
      throw new BadRequestException(
        'O arquivo Excel e a imagem são obrigatórios!',
      );
    }

    const file = files.file[0];
    const image = files.image[0];

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    const numbers = data.map((number) => number['Número']);
    const formattedNumbers = numbers.map((number) => {
      number = String(number);

      if (number.length > 12) {
        number = number.slice(0, 5) + number.slice(6);
      }

      return number;
    });

    if (data.length === 0 || !data[0].hasOwnProperty('Número')) {
      throw new BadRequestException(
        'O arquivo Excel deve conter uma coluna chamada "Número"',
      );
    }

    if (body.name !== undefined) {
      body.name = body.name === 'true';
    }

    await this.whatsappService.sendAllMessages(
      'media',
      formattedNumbers,
      body.startDelay,
      body.endDelay,
      body.message,
      image,
      body.name,
    );
  }

  @Post('send-messages-image-only')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file' }, { name: 'image' }], {
      storage: memoryStorage(),
    }),
  )
  async sendMessagesFromExcelMediaOnly(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Body()
    body: {
      startDelay: number;
      endDelay: number;
    },
  ) {
    if (!files?.file || !files?.image) {
      throw new BadRequestException(
        'O arquivo Excel e a imagem são obrigatórios!',
      );
    }

    const file = files.file[0];
    const image = files.image[0];

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    const numbers = data.map((number) => number['Número']);
    const formattedNumbers = numbers.map((number) => {
      number = String(number);

      if (number.length > 12) {
        number = number.slice(0, 5) + number.slice(6);
      }

      return number;
    });

    if (data.length === 0 || !data[0].hasOwnProperty('Número')) {
      throw new BadRequestException(
        'O arquivo Excel deve conter uma coluna chamada "Número"',
      );
    }

    await this.whatsappService.sendAllMessages(
      'media',
      formattedNumbers,
      body.startDelay,
      body.endDelay,
      '',
      image,
    );
  }

  @Post('logout')
  async logout() {
    return this.whatsappService.logout();
  }
}
