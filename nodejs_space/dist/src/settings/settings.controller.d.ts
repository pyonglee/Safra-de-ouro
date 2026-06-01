import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(req: any): Promise<{
        pricePerBalaio: number;
    }>;
    update(req: any, dto: UpdateSettingsDto): Promise<{
        pricePerBalaio: number;
    }>;
}
