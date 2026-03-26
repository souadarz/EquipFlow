import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@repo/shared';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CloseMaintenanceDto } from './dto/close-maintenance.dto';
import { RolesGuard } from 'src/common/guards/role.guard';

@Controller('maintenances')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)


export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Types.ObjectId, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Patch(':id')
  close(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() closeMaintenanceDto: CloseMaintenanceDto) {
    return this.maintenanceService.update(id, closeMaintenanceDto);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.maintenanceService.remove(id);
  }
}
