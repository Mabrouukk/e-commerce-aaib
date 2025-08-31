import {IsEmail,MinLength} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password_hash: string;
}
export default CreateUserDto;