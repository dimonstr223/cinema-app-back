import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  @Get('get/:id')
  getParam(@Param('id', ParseIntPipe) id: number) {
    return id
  }
}
