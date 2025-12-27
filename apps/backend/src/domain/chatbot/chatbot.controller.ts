import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { User } from 'src/application/common/decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  async sendOpenaiResponse(@Body() messageBody: SendMessageDto, @User() user: { id: string}){
    return await this.chatbotService.sendOpenaiResponse(messageBody.message, user.id);
  }
}
