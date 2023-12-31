import { IsString } from 'class-validator'

export class RefreshToketDto {
	@IsString({ message: 'You did not pass refresh token or it is not a string!' })
	refreshToken: string
}