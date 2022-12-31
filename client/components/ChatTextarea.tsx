import useAutosizeTextArea from 'hooks/useAutosizeTextArea';
import SendIcon from 'icon/SendIcon';
import React, { useState } from 'react'


export default function ChatTextArea({sendMessage, conversation, scrollToBottom, sendingMessage }: any) {
    const [content, setContent] = useState<string>('');
  const textAreaRef = useAutosizeTextArea(content);

    const handleSendMessage = () => {
    const trimmedMessage = content.trim();
    if (!trimmedMessage) return;

    setContent('');
    sendMessage(content);
    scrollToBottom && scrollToBottom(true);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === 'Enter') return;
    if (content.trim() === '') {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <>
    {(conversation?.status === 'ACTIVE' || conversation === null) && (
       <div className="flex justify-center focus:outline-0">
          <div className="fixed py-8 bottom-[-40px] min-[600px]:w-[600px] w-[100vw] flex mx-auto text-center justify-center focus:outline-0">
            <div className="relative bottom-0 focus:outline-0">
                <>
                  <textarea
                    className="border-0 pl-8 pr-16 min-[600px]:w-[600px] w-[96vw] py-6 text-opacity-70"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="type something, durh"
                    ref={textAreaRef}
                    onKeyUp={(e) => handleEnter(e)}
                    rows={6}
                    value={content}
                  />
                  {content.length > 0 && (
                    <button
                      className="absolute right-4 h-[100%]"
                      disabled={sendingMessage}
                      onClick={handleSendMessage}
                    >
                      <SendIcon />
                    </button>
                  )}
                </>
            </div>
          </div>
        </div>
    )}
  </>
  )}
