import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

import {
  GetUsersByFiltersParam,
  GetUsersResponse,
  VerificationParams,
} from './account.types.js';

@Injectable()
export class InternalAccountService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

   async verification(params: VerificationParams): Promise<boolean> {
    const url = `${this.config.get('ACCOUNT_URL')}/user/verification`;

    try {
      const res = await this.httpService.axiosRef.get(url, { params });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const { status } = error.response;

        if (status === 404) {
          throw new NotFoundException('user not found');
        }
        if (status === 401) {
          throw new UnauthorizedException('invalid password');
        }
      }
      throw error;
    }
  }

   async GetUsersByFilter(
    params: GetUsersByFiltersParam,
  ): Promise<GetUsersResponse> {
    const url = `${this.config.get('ACCOUNT_URL')}/user`;

    try {
      const res = await this.httpService.axiosRef.get(url, { params });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { items: [], total: 0 };
      }
      throw error;
    }
  }
}