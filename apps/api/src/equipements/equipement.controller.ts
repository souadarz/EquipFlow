import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { EquipementService } from './equipement.service';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@repo/shared';
import { QueryEquipementDto } from './dto/QueryEquipementDto';

@Controller('equipements')
export class EquipementController {
  constructor(private readonly equipementService: EquipementService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createEquipementDto: CreateEquipementDto) {
    return this.equipementService.create(createEquipementDto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file: Express.Multer.File, cb: (error: Error | null, dest: string) => void) => {
          const dir = './uploads';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req: any, file: Express.Multer.File, cb: (error: Error | null, dest: string) => void) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Seules les images sont acceptées'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    return { url: `/uploads/${file.filename}` };
  }

  @Get()
  findAll(@Query() query: QueryEquipementDto) {
    return this.equipementService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.equipementService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateEquipementDto: UpdateEquipementDto,
  ) {
    return this.equipementService.update(id, updateEquipementDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.equipementService.remove(id);
  }
}
