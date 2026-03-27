import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthUser, Role } from '@repo/shared';
import { QueryReservationDto } from './dto/query-reservetion.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: AuthUser) {
    return this.reservationService.create(createReservationDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() query: QueryReservationDto, @CurrentUser() user: AuthUser) {
    return this.reservationService.findAll(query, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @CurrentUser() user: AuthUser) {
    return this.reservationService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.reservationService.update(id, updateReservationDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.reservationService.remove(id);
  }
}
