"use client";

import { FC, useRef, useEffect, Fragment, useState } from "react";

// ... (BAGIAN TYPES DAN HELPERS TETAP SAMA, TIDAK ADA PERUBAHAN) ...
// ... (BAGIAN SUB-COMPONENTS SEPERTI DateSeparator, BotBubbleTail DLL TETAP SAMA) ...

// COPY PASTE TYPES & HELPERS & SUB-COMPONENTS DARI KODE ANDA SEBELUMNYA DI SINI
// SAYA AKAN LANGSUNG MASUK KE PERUBAHAN DI COMPONENT UTAMA:

// ... TYPES ...
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
  messages?: ChatMessage[];
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
    <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-3 py-1 rounded-full">
      {date}
    </span>
  </div>
);

const SimpleEmojiPicker: FC<{ onEmojiClick: (emoji: string) => void }> = ({ onEmojiClick }) => {
  const emojis = [
    "😀", "😂", "😍", "😭", "😡", "👍", "👎", "🎉", "❤️", "🔥",
    "😊", "🤔", "🙄", "😴", "🤮", "🤧", "😷", "🥴", "🥳", "🥺",
    "👋", "🙏", "💪", "🤝", "👀", "🧠", "💩", "👻", "💀", "👽"
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 grid grid-cols-6 gap-2 h-[200px] overflow-y-auto">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiClick(emoji)}
          className="text-xl hover:bg-gray-100 p-2 rounded-md transition-colors flex items-center justify-center"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const BotBubbleTail: FC<{ children: React.ReactNode; time?: string }> = ({
  children,
  time,
}) => {
  return (
    <div className="relative group max-w-fit">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/union.svg')",
          backgroundSize: "100% 100%", 
          backgroundRepeat: "no-repeat",
        }}
      />
      <div 
        className="relative z-10 pt-3 px-6 pb-9 min-w-[120px]"
      >
        <div className="text-sm leading-relaxed text-gray-700 font-normal whitespace-pre-wrap break-words">
          {children}
        </div>

        {time && (
          <span className="text-[11px] text-gray-400 mt-1 text-right block font-light opacity-80">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

const TypingIndicator: FC = () => (
  <div className="flex items-start max-w-xs mb-3 px-3">
    <img
      src="/MidiLand.png"
      alt="MidiLand Assistant"
      width={32}
      height={32}
      className="rounded-full mr-2 flex-shrink-0 bg-gray-100 object-contain p-1"
      style={{ width: '36px', height: '36px' }}
    />

    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 mb-1 ml-2">MidiLand Assisten</span>
      <BotBubbleTail>
        <div className="flex space-x-1 py-1 px-1">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
          <span
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </BotBubbleTail>
    </div>
  </div>
);

const ReadReceipt: FC<{
  status?: "pending" | "sent" | "read" | "failed";
  messageId: string;
  onRetry: (id: string) => void;
}> = ({ status, messageId, onRetry }) => {
  if (status === "failed") {
    return (
      <button
        onClick={() => onRetry(messageId)}
        className="ml-1 text-red-300 hover:text-white"
        title="Gagal terkirim. Klik untuk coba lagi."
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </button>
    );
  }
  if (status === "pending") {
    return (
      <svg className="w-3 h-3 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (status === "sent") {
    return (
      <svg className="w-3 h-3 ml-1 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === "read") {
    return (
      <svg className="w-3 h-3 ml-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} opacity={0.6} d="M9 13l4 4L23 7" />
      </svg>
    );
  }
  return null;
};

// --- MAIN COMPONENT ---

const ChatWindow: FC<ChatWindowProps> = ({
  messages = [],
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

  const handleEmojiClick = (emoji: string) => {
    onDraftMessageChange(draftMessage + emoji);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    // 1. WRAPPER UTAMA (Tanpa background, tanpa overflow-hidden)
    // Ini bertugas memposisikan widget di layar
    <div className="fixed bottom-20 right-4 w-96 z-50 font-sans">
      
      {/* 2. GAMBAR MASCOT (Dikeluarkan dari kartu utama) */}
      {/* Posisi absolute relative terhadap wrapper utama, z-index tinggi agar di atas kartu */}
      <div 
        className="absolute z-50 pointer-events-none" 
        style={{ top: "-74px", left: "-5px" }} // Sesuaikan top agar pas pop-out nya
      >
          <img
            src="/midiland-assistant.svg"
            alt="Milan Virtual Assistant"
            width={160}
            height={160}
            className="object-contain drop-shadow-xl" // Tambahkan drop-shadow agar menyatu
            style={{ width: '160px', height: '160px' }}
          />
      </div>

      {/* 3. KARTU CHAT (Container Background Putih) */}
      {/* Memiliki rounded corners dan overflow-hidden agar isinya rapi */}
      <div className="flex flex-col w-full h-[70vh] max-h-[600px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 relative z-10">
        
        {/* HEADER (Tanpa Gambar Mascot karena sudah dipindah ke atas) */}
        <div className="relative w-full h-[85px] bg-[#D32F2F] flex items-center overflow-hidden px-4 shrink-0">
          <div className="absolute -right-12 -top-16 w-40 h-40 bg-[#E53935] rounded-full opacity-40"></div>
          <div className="absolute -left-10 -bottom-20 w-32 h-32 bg-[#E53935] rounded-full opacity-30"></div>

          <div className="flex flex-col ml-[130px] text-white z-10">
            <h2 className="text-xl font-bold tracking-wide">Milan</h2>
            <p className="text-[12px] text-red-100 opacity-90">Virtual Assistant Andalanmu!</p>
          </div>

          <div className="absolute top-4 right-4 flex space-x-2 z-20">
            <button
              onClick={onPromptEndSession}
              className="w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition backdrop-blur-sm"
              title="Hapus Riwayat Chat"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
             <button
              onClick={onClose}
              className="w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition backdrop-blur-sm"
              title="Tutup Chat"
            >
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA] pt-6 pb-4 scrollbar-thin scrollbar-thumb-gray-200 px-4">
          <div className="mt-2 mb-6">
            {messages.length === 0 ? (
              <DateSeparator date={formatChatDate(Date.now())} />
            ) : (
              <DateSeparator date={formatChatDate(messages[0].timestamp)} />
            )}
          </div>

          {messages.map((msg, index) => {
            const currentDateStr = formatChatDate(msg.timestamp);
            const prevDateStr = index > 0 ? formatChatDate(messages[index - 1].timestamp) : null;
            const showDateSeparator = index > 0 && currentDateStr !== prevDateStr;

            if (msg.isConfirmation) {
              return (
                <div key={msg.id} className="flex justify-center px-4 py-4">
                  <div className="bg-white border border-red-100 p-5 rounded-2xl text-center shadow-sm w-full max-w-[280px]">
                    <p className="text-sm text-gray-700 mb-4 font-medium">
                      Anda yakin ingin menghapus riwayat chat ini?
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={onCancelEndSession}
                        className="py-2 px-5 text-sm bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-colors font-medium"
                      >
                        Batal
                      </button>
                      <button
                        onClick={onConfirmEndSession}
                        className="py-2 px-5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium shadow-sm"
                      >
                        Ya, Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Fragment key={msg.id}>
                {showDateSeparator && <DateSeparator date={currentDateStr} />}

                <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-5`}>
                  
                  {/* BOT MESSAGE */}
                  {msg.sender === "bot" && (
                    <div className="flex items-end max-w-[85%]">
                      {/* Avatar */}
                      {msg.avatar ? (
                        <img
                          src={msg.avatar}
                          alt={msg.name || "bot"}
                          width={36}
                          height={36}
                          className="rounded-full mr-3 flex-shrink-0 bg-gray-50 object-contain p-0.5 border border-gray-100 shadow-sm"
                          style={{ width: '36px', height: '36px' }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-100 mr-3 flex-shrink-0 border border-gray-200 shadow-sm" />
                      )}

                      <div className="flex flex-col">
                        {msg.name && (
                          <span className="text-[11px] text-gray-500 mb-1.5 ml-1 font-medium">{msg.name}</span>
                        )}
                        
                        <BotBubbleTail time={formatChatTime(msg.timestamp)}>
                          {msg.text}
                        </BotBubbleTail>
                      </div>
                    </div>
                  )}

                  {/* USER MESSAGE */}
                  {msg.sender === "user" && (
                    <div className="flex items-end max-w-[85%]">
                      <div className="bg-red-600 text-white p-3.5 rounded-[22px] rounded-br-[4px] shadow-md relative">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex justify-end items-center mt-1.5 space-x-1 opacity-90">
                          <span className="text-[11px] text-red-50 font-light">
                            {formatChatTime(msg.timestamp)}
                          </span>
                          <ReadReceipt status={msg.status} messageId={msg.id} onRetry={onRetrySend} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Fragment>
            );
          })}

          {isBotTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white border-t border-gray-50">
          <div className="relative flex items-end bg-gray-50 rounded-[24px] px-2 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-300 transition-all">
            
            {/* Left Actions */}
            <div className="flex items-center space-x-1 mr-1 pb-1">
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                disabled={isInputDisabled}
                onClick={onShowEmojiPickerToggle}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                disabled={isInputDisabled}
                onClick={() => alert("Fitur Lampirkan File belum tersedia")}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>

            {/* Input Field */}
            <textarea
              rows={1}
              placeholder="Ketik pesan Anda..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-700 placeholder-gray-400 py-2 px-1 disabled:opacity-70 resize-none max-h-[120px] scrollbar-thin scrollbar-thumb-gray-300"
              value={draftMessage}
              onChange={(e) => {
                  onDraftMessageChange(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                    const textarea = e.target as HTMLTextAreaElement;
                    setTimeout(() => { textarea.style.height = 'auto'; }, 0);
                  }
              }}
              disabled={isInputDisabled}
            />

            {/* Send Button */}
            <button
              className={`p-2.5 ml-2 rounded-full transition-all duration-300 pb-2.5 ${
                draftMessage.trim() && !isInputDisabled
                  ? "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
              onClick={handleSend}
              disabled={!draftMessage.trim() || isInputDisabled}
            >
              <svg className="w-5 h-5 transform rotate-90 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* EMOJI PICKER (Letakkan di luar card juga supaya tidak terpotong) */}
      {showEmojiPicker && (
        <div className="absolute z-50 bottom-[85px] left-4 w-[300px]">
          <SimpleEmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;