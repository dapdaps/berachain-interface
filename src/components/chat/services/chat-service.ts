import { Message, ChatHistory } from '../context/chat-context';

export const createNewChat = async (message: string): Promise<{
  messages: Message[];
  chatHistory: ChatHistory;
}> => {
  try {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      senderName: 'McBera',
      content: 'This is a simulated response. In a real application, this should be the API response.',
    };
    
    const chatId = Date.now().toString();
    
    const chatHistory: ChatHistory = {
      id: chatId,
      title: message.length > 20 ? `${message.substring(0, 20)}...` : message,
      lastMessage: assistantMessage.content,
      timestamp: new Date().toISOString(),
    };
    
    return {
      messages: [userMessage, assistantMessage],
      chatHistory
    };
  } catch (error) {
    console.error('Create New Chat Failed:', error);
    throw error;
  }
};

export const fetchChatHistory = async (chatId: string): Promise<Message[]> => {
  try {
    console.log(`Get Chat history ${chatId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const historyMessages: Message[] = [
      {
        id: '1',
        sender: 'user',
        content: `This is id ${chatId} message from user.`,
      },
      {
        id: '2',
        sender: 'assistant',
        senderName: 'McBera',
        content: 'This is a simulated response from the assistant.',
      },
    ];
    
    return historyMessages;
  } catch (error) {
    console.error('Get History:', error);
    throw error;
  }
};

export const fetchChatHistoryList = async (): Promise<ChatHistory[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const histories: ChatHistory[] = [
      {
        id: '1',
        title: 'How to use DapDap',
        lastMessage: 'Connect...',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Berachain title',
        lastMessage: 'Berachain is focused on DeFi...',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 昨天
      },
    ];
    
    return histories;
  } catch (error) {
    console.error('Get History:', error);
    throw error;
  }
};