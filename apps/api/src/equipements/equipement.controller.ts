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
} from '@nestjs/common';
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
