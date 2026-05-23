import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { EncomiendasService } from './encomiendas.service';
@ApiTags('encomiendas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('encomiendas')
export class EncomiendasController {
  constructor(private service:EncomiendasService) {}
  @Get() findAll(@Query('q') q:string, @Query('page') page='1', @Query('limit') limit='10') { return this.service.findAll(q, +page, +limit); }
  @Get(':id') findOne(@Param('id') id:string) { return this.service.findOne(+id); }
  @Post() create(@Body() body:any) { return this.service.create(body); }
  @Patch(':id') update(@Param('id') id:string, @Body() body:any) { return this.service.update(+id, body); }
  @Delete(':id') remove(@Param('id') id:string) { return this.service.remove(+id); }
}
