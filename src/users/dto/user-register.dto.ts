import { IsEmail, IsString, Length } from "class-validator";

export class userRegisterDto {
  @IsEmail({}, { message: "wrong email" })
  email: string;

  @IsString({ message: "password should be in 5-20 diapason" })
  @Length(5, 20)
  password: string;

  @Length(2, 12)
  @IsString({ message: "Name shouldn't be longer than 2-12 chars" })
  name: string;
}
