"use client";

import { useState } from "react";
import Image from "next/image";
import ChatWindow, { type ChatMessage } from "./ChatWindow";
import { getInitialMessage } from "./utils";
import { getBotResponse } from "./chatLogic";

const SIMULATE_FAILURE = false;

const sendMessageToServer = (message: ChatMessage): Promise<void> => {
  console.log("Attempting to send message:", message.id);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_FAILURE || !navigator.onLine) {
        console.warn("Network call failed for:", message.id);
        reject(new Error("Simulated network failure or offline"));
      } else {
        console.log("Network call successful for:", message.id);
        resolve();
      }
    }, 1500);
  });
};

interface ChatBotButtonProps {
  userName?: string;
  userAvatar?: string;
}

export function ChatBotButton({ userName, userAvatar }: ChatBotButtonProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessage(userName));
  const [isOpen, setIsOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isCurrentlyConfirming = messages.some((msg) => msg.isConfirmation === true);
  const performSend = async (messageToSend: ChatMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === messageToSend.id ? { ...m, status: "pending" } : m)));
    try {
      await sendMessageToServer(messageToSend);
      setMessages((prev) => prev.map((m) => (m.id === messageToSend.id ? { ...m, status: "sent" } : m)));
      setIsBotTyping(true);

      setTimeout(() => {
        const botText = getBotResponse(messageToSend.text);
        const botResponse: ChatMessage = {
          id: crypto.randomUUID(),
          text: botText,
          sender: "bot",
          name: "MidiLand Assisten",
          avatar: "/chatbot.png",
          timestamp: Date.now(),
          isConfirmation: false,
        };

        setMessages((prevMessages) => [
          ...prevMessages.map((msg) => (msg.id === messageToSend.id ? { ...msg, status: "read" as const } : msg)),
          botResponse,
        ]);

        setIsBotTyping(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsBotTyping(false);
      setMessages((prev) => prev.map((m) => (m.id === messageToSend.id ? { ...m, status: "failed" } : m)));
    }
  };

  const handleSend = (text: string) => {
    if (isCurrentlyConfirming) return;

    setDraftMessage("");
    setShowEmojiPicker(false);

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      name: userName, 
      avatar: userAvatar,
      timestamp: Date.now(),
      status: "pending",
      isConfirmation: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    performSend(newMessage);
  };

  const handleRetrySend = (messageId: string) => {
    const messageToRetry = messages.find((m) => m.id === messageId);
    if (messageToRetry) {
      performSend(messageToRetry);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowEmojiPicker(false);
    setMessages((prev) => prev.filter((msg) => !msg.isConfirmation));
  };

  const handleOpen = () => setIsOpen(true);

  const handlePromptEndSession = () => {
    if (isCurrentlyConfirming) return;
    const confirmMessage: ChatMessage = {
      id: "confirm-delete-prompt",
      text: "",
      sender: "bot",
      name: "",
      avatar: "",
      timestamp: Date.now(),
      isConfirmation: true,
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  const handleConfirmEndSession = () => {
    setMessages(getInitialMessage(userName));
    setIsOpen(false);
  };

  const handleCancelEndSession = () => {
    setMessages((prev) => prev.filter((msg) => !msg.isConfirmation));
  };

  return (
    <>
      <button
        onClick={() => (isOpen ? handleClose() : handleOpen())}
        className="fixed bottom-4 right-4 z-40 flex items-center cursor-pointer group"
        aria-label={isOpen ? "Tutup Chat" : "Buka Chat"}
      >
        <div className="relative w-14 h-14 md:w-20 md:h-20 flex-shrink-0 z-20">
          <div className="absolute inset-0 rounded-full bg-white shadow-lg overflow-hidden border-2 border-gray-100">
            <Image src="/chatbot.png" alt="Milan Assistant" fill className="object-cover object-top" />
          </div>
        </div>

        <div className="relative ml-[-18px] md:ml-[-25px] z-10">
          <div className="relative">
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] md:-translate-x-[6px] w-0 h-0"
              style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "6px solid #e4002b" }}
            />

            <div className="bg-[#e4002b] rounded-2xl px-4 py-2 md:px-6 md:py-2.5 shadow-lg min-w-[140px] md:min-w-[190px]">
              <p className="text-white text-[10px] md:text-[12px] leading-tight">Merasa tersesat?</p>
              <p className="text-white font-bold text-[12px] md:text-[14px] leading-tight">Yuk #TanyaMilan!</p>
            </div>
          </div>
          
          <div className="absolute -top-4 -right-2 md:-top-5 md:-right-3 z-30">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src="/chatbot-floating.svg" 
                alt="New message notification" 
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <ChatWindow
          messages={messages}
          isBotTyping={isBotTyping}
          onClose={handleClose}
          onSend={handleSend}
          isInputDisabled={isBotTyping || isCurrentlyConfirming}
          onPromptEndSession={handlePromptEndSession}
          onConfirmEndSession={handleConfirmEndSession}
          onCancelEndSession={handleCancelEndSession}
          draftMessage={draftMessage}
          onDraftMessageChange={setDraftMessage}
          showEmojiPicker={showEmojiPicker}
          onShowEmojiPickerToggle={() => setShowEmojiPicker(!showEmojiPicker)}
          onRetrySend={handleRetrySend}
        />
      )}
    </>
  );
}