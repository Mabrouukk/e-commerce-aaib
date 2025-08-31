import { Controller, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import {Get,Post,Body,Delete} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService:UsersService){}
    @Post()
    create(@Body() createUserDto:CreateUserDto):Promise<User>{
        return this.usersService.create(createUserDto);
    }
    @Get()
    findAll(){
        return this.usersService.findAll();
    }
    @Get(':id')
    findOne(@Param ('id') id:string){ //param decorator is used to extract the id parameter from the URL
        return this.usersService.findOne(+id);
    }
    @Delete(':id')
    remove(@Param ('id') id:string){
        return this.usersService.remove(+id);//+id to convert string to number
    }






}
