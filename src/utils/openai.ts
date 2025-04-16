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
        { role: 'developer', content: '너는 한글 랜덤 닉네임을 생성해주는 봇이야.' },
        {
          role: 'user',
          content: '띄어쓰기 없이 한글 닉네임 1개를 생성해줘. 길이는 5자 이상 15자 이상인 닉네임이어야 해.',
        },
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
