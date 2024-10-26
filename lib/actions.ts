import { Message } from '@/components/ChatWindow';

export const getSuggestions = async (chatHisory: Message[]) => {
  const chatModel = localStorage.getItem('chatModel');
  const chatModelProvider = localStorage.getItem('chatModelProvider');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_history: chatHisory,
      chat_model: chatModel,
      chat_model_provider: chatModelProvider,
    }),
  });

  const data = (await res.json()) as { suggestions: string[] };

  return data.suggestions;
};

export const getSummary = async (id: string, query: string, chatHisory: Message[]) => {
  const chatModel = localStorage.getItem('chatModel');
  const chatModelProvider = localStorage.getItem('chatModelProvider');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      query,
      chat_history: chatHisory,
      chat_model: chatModel,
      chat_model_provider: chatModelProvider,
    }),
  });

  if (res.status === 200) {
    const data = (await res.json()) as { summary: string };
    return data.summary;
  }
  return null
};

export const downloadUrl = async (url: string, userId: string) => {
  let api = `${process.env.NEXT_PUBLIC_API_URL}/ytdownload`;
  if(url.includes('douyin.com')) {
    api = `${process.env.NEXT_PUBLIC_API_URL}/dydownload`;
  }
  const res = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      userId
    }),
  });

  if (res.status === 200) {
    const result = await fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'video_analysis'
      }),
    });
    const data = await res.json();
    const resultJson = await result.json();
    return {
      ...data,
      userData: resultJson
    }
  }
};
