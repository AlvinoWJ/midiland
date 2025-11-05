"use client";

import { useState } from "react";
import ChatWindow, { type ChatMessage } from "./ChatWindow";
import { Button } from "@/components/ui/button";
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

const ChatIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 21l1.255-3.765A9.863 9.863 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

interface ChatBotButtonProps {
  userName?: string;
  userAvatar?: string;
}

export function ChatBotButton({ userName, userAvatar }: ChatBotButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(
    getInitialMessage(userName)
  );
  const [draftMessage, setDraftMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isCurrentlyConfirming = messages.some(msg => msg.isConfirmation === true);


  const performSend = async (messageToSend: ChatMessage) => {
    setMessages(prev => prev.map(m => 
        m.id === messageToSend.id ? { ...m, status: "pending" } : m
    ));
    try {
      await sendMessageToServer(messageToSend);

      setMessages(prev => prev.map(m => 
          m.id === messageToSend.id ? { ...m, status: "sent" } : m
      ));

      setIsBotTyping(true);

      setTimeout(() => {
        const botText = getBotResponse(messageToSend.text); 
        const botResponse: ChatMessage = {
          id: crypto.randomUUID(),
          text: botText, 
          sender: "bot",
          name: "MidiLand Assisten",
          avatar: "/MidiLand.png",
          timestamp: Date.now(),
          isConfirmation: false,
        };

        setMessages((prevMessages) => [
          ...prevMessages.map((msg) =>
            msg.id === messageToSend.id ? { ...msg, status: "read" as const } : msg
          ),
          botResponse,
        ]);

        setIsBotTyping(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsBotTyping(false);
      setMessages(prev => prev.map(m => 
          m.id === messageToSend.id ? { ...m, status: "failed" } : m
      ));
    }
  };

  const handleSend = (text: string) => {
    if (isCurrentlyConfirming) return;

    setDraftMessage(""); 
    setShowEmojiPicker(false);

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: text,
      sender: "user",
      avatar: userAvatar,
      timestamp: Date.now(),
      status: "pending",
      isConfirmation: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    performSend(newMessage);
  };

  const handleRetrySend = (messageId: string) => {
    const messageToRetry = messages.find(m => m.id === messageId);
    if (messageToRetry) {
      performSend(messageToRetry);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowEmojiPicker(false);
    setMessages(prev => prev.filter(msg => !msg.isConfirmation));
  };
  const handleOpen = () => setIsOpen(true);

  const handlePromptEndSession = () => {
    if (isCurrentlyConfirming) return;
    const confirmMessage: ChatMessage = {
      id: 'confirm-delete-prompt',
      text: '', sender: 'bot', name: '', avatar: '',
      timestamp: Date.now(), isConfirmation: true,
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleConfirmEndSession = () => {
    setMessages(getInitialMessage(userName));
    setIsOpen(false);
  };

  const handleCancelEndSession = () => {
    setMessages(prev => prev.filter(msg => !msg.isConfirmation));
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-2xl z-40 flex items-center justify-center"
        aria-label="Buka Chat"
      >
        <ChatIcon />
      </Button>

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