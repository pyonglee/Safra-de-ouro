import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user settings' })
  get(@Request() req: any) {
    return this.settingsService.get(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  update(@Request() req: any, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(req.user.userId, dto.pricePerBalaio);
  }
}
