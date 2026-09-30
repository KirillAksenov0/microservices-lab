import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { InternalAccountService } from './account.service.js';

@Module({
  imports: [HttpModule],

  providers: [
    InternalAccountService,
  ],

  exports: [
    InternalAccountService,
  ],
})
export class AccountModule {}