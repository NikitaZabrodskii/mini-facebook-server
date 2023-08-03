import { IsEmail, IsString, Length } from "class-validator";

export class userLoginDto {
  @IsEmail({}, { message: "wrong email" })
  email: string;

  @IsString({ message: "password should be in 5-20 diapason" })
  @Length(5, 20)
  password: string;
}
