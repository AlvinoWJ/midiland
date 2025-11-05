import { ChatMessage } from './ChatWindow';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

export function getInitialMessage(userName?: string): ChatMessage[] {
  const dynamicGreetingText = userName
    ? `${getGreeting()}, ${userName}!`
    : `${getGreeting()}!`;
  const initialTimestamp = Date.now();

  const greetingMessage: ChatMessage = {
    id: 'init-greeting',
    text: dynamicGreetingText,
    sender: 'bot',
    name: 'MidiLand Assisten',
    avatar: '/MidiLand.png',
    timestamp: initialTimestamp,
  };
  
  const introMessage: ChatMessage = {
    id: 'init-intro',
    text: "Halo! Perkenalkan Saya MidiLand Assisten, asisten virtual yang siap membantu Anda!",
    sender: 'bot',
    name: 'MidiLand Assisten',
    avatar: '/MidiLand.png',
    timestamp: initialTimestamp,
  };
  return [greetingMessage, introMessage];
}