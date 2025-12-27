import { Module } from '@nestjs/common';
import OpenAI from 'openai';

const OpenAIProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: () => {
    return new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });
  },
};

@Module({
  providers: [OpenAIProvider],
  exports: [OpenAIProvider],
})
export class OpenAiModule {}
