import { Module } from '@nestjs/common';
import { EnvModule } from '../config/env.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { ApplicationModule } from './application.module';
import { DomainModule } from './domain.module';
import { PresentationModule } from './presentation.module';

@Module({
  imports: [
    EnvModule,
    ApplicationModule,
    DomainModule,
    PresentationModule
  ],
})
export class AppModule {}

