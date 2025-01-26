import OpenAI from 'openai';
import { OPENAI_API_KEY } from './env';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: '너는 한글 랜덤 닉네임을 생성해주는 봇이야.' },
    {
      role: 'user',
      content: '띄어쓰기 없이 8자 이상 20자 이하의 닉네임을 생성해줘.',
    },
  ],
  store: true,
});

export function getRandomNickname() {
  return completion.choices[0].message.content;
}
