"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: '*' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const swaggerPath = 'api-docs';
    app.use(`/${swaggerPath}`, (req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        next();
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Safra de Ouro API')
        .setDescription('API para gerenciamento de fazendas de caf\u00e9 - Safra de Ouro')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(swaggerPath, app, document, {
        customSiteTitle: 'Safra de Ouro API',
        customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 30px 0; }
      .swagger-ui .info .title { color: #2d5016; font-size: 2em; }
      .swagger-ui .info .description { color: #555; font-size: 1.1em; }
      .swagger-ui .opblock-tag { color: #2d5016; font-size: 1.1em; border-bottom: 1px solid #e8e8e8; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73, 204, 144, 0.05); }
      .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97, 175, 254, 0.05); }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249, 62, 62, 0.05); }
      .swagger-ui .opblock.opblock-patch { border-color: #50e3c2; background: rgba(80, 227, 194, 0.05); }
      .swagger-ui .btn.authorize { color: #2d5016; border-color: #2d5016; }
      .swagger-ui .btn.authorize svg { fill: #2d5016; }
      body { background: #fafafa; }
    `,
    });
    await app.listen(3000);
    logger.log('Safra de Ouro API running on port 3000');
    logger.log(`Swagger docs at http://localhost:3000/${swaggerPath}`);
}
bootstrap();
//# sourceMappingURL=main.js.map