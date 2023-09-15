import { ModelType } from '@typegoose/typegoose/lib/types'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { hash, genSalt, compare } from 'bcryptjs'

import { UserModel, IUseModel } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<IUseModel>,
    private readonly jwtService: JwtService
  ) {}
  
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto)

    const tokens = await this.issueTokenPair(String(user._id))

    return {
      // @ts-ignore
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async register(dto: AuthDto) {
    const oldUser = await this.UserModel.findOne({email: dto.email})
    if(oldUser) throw new BadRequestException('This email is already used!')

    const salt = await genSalt(8)

    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt)
    })

    const tokens = await this.issueTokenPair(String(newUser._id))

    return {
      // @ts-ignore
      user: this.returnUserFields(newUser),
      ...tokens
    }
  }

  async validateUser(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email })
    if (!user) throw new UnauthorizedException('User not found')

    const isValidPass = await compare(dto.password, user.get('password'))
    if(!isValidPass) throw new UnauthorizedException('Invalid email or password!')
    return user
  }

  async issueTokenPair(userId: string) {
    const data = { _id: userId }

    const refreshToken = await this.jwtService.signAsync(data, { expiresIn: '15d' })
    const accessToken  = await this.jwtService.signAsync(data, { expiresIn: '1h' })

    return { refreshToken, accessToken }
  }

  returnUserFields(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  }
}
