import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(4, { message: 'Password cannot be less then 4 characters!' })
	@IsString()
	password: string
}