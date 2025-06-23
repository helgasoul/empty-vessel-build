
import { GatewayRouter } from './router';
import { authModule } from './modules/auth-module';
import { medicalModule } from './modules/medical-module';
import { riskAssessmentModule } from './modules/risk-assessment-module';

// Создаем и настраиваем единый роутер
export const gatewayRouter = new GatewayRouter();

// Регистрируем все модули
gatewayRouter.registerModule(authModule);
gatewayRouter.registerModule(medicalModule);
gatewayRouter.registerModule(riskAssessmentModule);

export { GatewayRouter };
export * from './types';
export * from './auth-middleware';
export * from './middleware';
