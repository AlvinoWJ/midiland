// file: components/chatbot/ChatWindow.tsx

import { FC, useRef, useEffect, Fragment } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  name?: string;
  avatar?: string;
  timestamp: number;
  status?: "pending" | "sent" | "read" | "failed";
  isConfirmation?: boolean;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isBotTyping: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  isInputDisabled: boolean; 
  onPromptEndSession: () => void;
  onConfirmEndSession: () => void;
  onCancelEndSession: () => void;
  draftMessage: string;
  onDraftMessageChange: (text: string) => void;
  showEmojiPicker: boolean;
  onShowEmojiPickerToggle: () => void;
  onRetrySend: (messageId: string) => void;
}

const formatChatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
};

const formatChatTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
};

const DateSeparator: FC<{ date: string }> = ({ date }) => (
  <div className="flex justify-center my-4">
    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
      {date}
    </span>
  </div>
);

const TypingIndicator: FC = () => (
  <div className="flex items-end max-w-xs mb-3">
    <Image 
      src="/MidiLand.png" 
      alt="MidiLand Assisten" 
      width={32} 
      height={32} 
      className="rounded-full mr-2 flex-shrink-0 bg-gray-100 object-contain p-1"
    />
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1 ml-2">MidiLand Assisten</span>
      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
        <div className="flex space-x-1 py-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-typing" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  </div>
);
// ... (Akhir fungsi tidak berubah) ...

const ReadReceipt: FC<{
  status?: "pending" | "sent" | "read" | "failed";
  messageId: string;
  onRetry: (id: string) => void;
}> = ({ status, messageId, onRetry }) => {
  
  // ✅ 3. Status "failed" (Ikon tanda seru merah)
  if (status === "failed") {
    return (
      <button 
        onClick={() => onRetry(messageId)} 
        className="ml-1.5 text-red-300 hover:text-white"
        title="Gagal terkirim. Klik untuk coba lagi."
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </button>
    );
  }

  if (status === "pending") {
    return (
      <svg className="w-4 h-4 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  if (status === "sent") {
    return (
      <svg className="w-4 h-4 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  
  if (status === "read") {
    return (
      <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" opacity="0.6" />
      </svg>
    );
  }
  return null;
};


const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  isBotTyping,
  onClose,
  onSend,
  isInputDisabled,
  onPromptEndSession,
  onConfirmEndSession,
  onCancelEndSession,
  draftMessage,
  onDraftMessageChange,
  showEmojiPicker,
  onShowEmojiPickerToggle,
  onRetrySend,
}) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleSend = () => {
    if (draftMessage.trim()) {
      onSend(draftMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onDraftMessageChange(draftMessage + emojiData.emoji);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
      
      {/* Header (tidak berubah) */}
      <div className="bg-red-600 text-white p-4">
         <div className="flex justify-between items-center mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
            <Image src="/MidiLand.png" alt="MidiLand Logo" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onPromptEndSession}
              className="text-white hover:text-gray-200" 
              title="Hapus Riwayat Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Hi there!</h2>
        <p className="text-sm text-red-100">Welcome to MidiLand. How can we help you today?</p>
      </div>

      {/* Pesan */}
      <div className="flex-1 overflow-y-auto bg-white">
         {messages.map((msg, index) => {
          const currentDateStr = formatChatDate(msg.timestamp);
          let prevDateStr: string | null = null;
          if (index > 0) {
            prevDateStr = formatChatDate(messages[index - 1].timestamp);
          }
          const showDateSeparator = currentDateStr !== prevDateStr;
          
          if (msg.isConfirmation) {
            return (
              <div key={msg.id} className="flex justify-start -mt-5">
                <div className="flex items-end max-w-xs w-full">
                  <div className="w-8 h-8 mr-2 flex-shrink-0" />
                  <div className="bg-white p-4 rounded-lg text-center shadow-sm flex-1">
                    <p className="text-xs text-gray-800 mb-3">
                      Anda yakin ingin menghapus riwayat chat ini?
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button
                        variant="outline"
                        onClick={onCancelEndSession}
                        className="h-9 px-6 text-xs hover:bg-gray-100 hover:text-gray-900"
                      >
                        Batal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={onConfirmEndSession}
                        className="h-9 px-6 text-xs"
                      >
                        Ya, Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Pesan biasa
          return (
            <Fragment key={msg.id}>
              {showDateSeparator && <DateSeparator date={currentDateStr} />}
              <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                
                {/* Pesan Bot (tidak berubah) */}
                {msg.sender === 'bot' && (
                  <div className="flex items-end max-w-xs mb-3">
                    {msg.avatar ? (
                      <Image 
                        src={msg.avatar} 
                        alt={msg.name || 'bot'} 
                        width={32} 
                        height={32} 
                        className="rounded-full mr-2 flex-shrink-0 bg-gray-100 object-contain p-1" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0" />
                    )}
                    <div className="flex flex-col">
                      {msg.name && <span className="text-xs text-gray-500 mb-1 ml-2">{msg.name}</span>}
                      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                        <p className="text-xs text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        <span className="text-xs text-gray-500 mt-1 text-right block">
                          {formatChatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Pesan User */}
                {msg.sender === 'user' && (
                  <div className="flex items-end max-w-xs mb-3">
                    <div className="bg-red-600 text-white p-3 rounded-lg rounded-br-none">
                      <p className="text-xs" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-xs text-red-200">
                          {formatChatTime(msg.timestamp)}
                        </span>
                        {/* ✅ 4. Teruskan props ke ReadReceipt */}
                        <ReadReceipt
                          status={msg.status}
                          messageId={msg.id}
                          onRetry={onRetrySend}
                        />
                      </div>
                    </div>
                    {msg.avatar ? (
                      <Image src={msg.avatar} alt="user" width={32} height={32} className="rounded-full ml-2 flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 ml-2 flex-shrink-0" />
                    )}
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
        
        {isBotTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input (tidak berubah dari kode Anda) */}
      <div className="p-3 bg-white border-t">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Write a reply..."
            className="w-full rounded-full bg-gray-100 pl-4 pr-40 py-2 border-none focus:ring-red-500 focus:ring-1 text-xs disabled:opacity-75"
            value={draftMessage}
            onChange={(e) => onDraftMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isInputDisabled}
          />
          <div className="absolute right-3 flex space-x-2">
            
            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50" 
              disabled={isInputDisabled} 
              title="Emoji"
              onClick={onShowEmojiPickerToggle}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50" 
              disabled={isInputDisabled} 
              title="Kirim Gambar"
              onClick={() => alert('Fitur Kirim Gambar belum tersedia')} 
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50" 
              disabled={isInputDisabled} 
              title="Lampirkan File"
              onClick={() => alert('Fitur Lampirkan File belum tersedia')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <button 
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50" 
              onClick={handleSend}
              disabled={!draftMessage.trim() || isInputDisabled}
              title="Kirim"
            >
              <Image
                src="/send.svg"
                alt="Kirim"
                width={15}
                height={15}
                className="opacity-70"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Panel Emoji Picker (tidak berubah) */}
      {showEmojiPicker && (
        <div 
          className="absolute z-20"
          style={{ bottom: '76px', right: '0px' }} 
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            height={350}
            width={300}
            searchDisabled
            skinTonesDisabled
          />
        </div>
      )}

    </div>
  );
};

export default ChatWindow;