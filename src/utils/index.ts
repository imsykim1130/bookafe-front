import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const getRandomNickname = async (): Promise<string | null> => {
  const randomNickname = await openai.chat.completions
    .create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '너는 8글자 이상 20글자 이하의 한글 랜덤 닉네임을 생성해주는 봇이야.' },
        { role: 'user', content: '띄어쓰기 없이 8글자 이상 20글자 이하의 한글 닉네임 1개를 생성해줘.' },
      ],
      store: true,
    })
    .then((res): string | null => {
      return res.choices[0].message.content;
    })
    .catch((err) => {
      console.error(err);
      return null;
    });

  return randomNickname;
};
