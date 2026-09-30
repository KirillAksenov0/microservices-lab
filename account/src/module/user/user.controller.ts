import { Controller, Get, Post, Body, 
  Patch, Param, Delete, Query} from '@nestjs/common';

import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserDto } from './dto/user.dto.js';
import GetUserFilterDto from './dto/get-users-filter.dto.js';
import { SignInDto } from './dto/sign-in.dto.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(
      createUserDto,
    );
  }

  @Get()
  findAll(
    @Query()
    getUserFilterDto: GetUserFilterDto,
  ): Promise<{
    items: UserDto[];
    total: number;
  }> {
    return this.userService.findAll(
      getUserFilterDto,
    );
  }

  @Get('verification')
verification(
  @Query() dto: SignInDto,
): Promise<boolean> {
  return this.userService.verification(dto);
}

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(
      id,
      updateUserDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.userService.remove(id);
  }
}