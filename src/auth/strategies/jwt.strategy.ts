import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from 'src/user/user.model'
import { InjectModel } from 'nestjs-typegoose'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate(payload): Promise<DocumentType<UserModel>> {
		return await this.UserModel.findById(payload._id).exec()
	}
}
