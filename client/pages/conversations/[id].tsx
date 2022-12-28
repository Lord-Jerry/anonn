import { useEffect, useRef, useState } from 'react';
import Navigation from 'components/Navigation';
import useAutosizeTextArea from 'utils/useAutosizeTextArea';
import SendIcon from 'icon/SendIcon';

import MessageBox from 'components/MessageBox';
import { GetServerSidePropsContext } from 'next';
import ProfileService from 'services/profile';
import useMessage from 'hooks/useMessage';
import Button from 'components/button';

export default function SingleConversation({
  conversationId,
}: {
  conversationId: string;
}) {
  const newMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState<string>('');

  const {
    messages,
    scrollRef,
    sendMessage,
    conversation,
    sendingMessage,
    messagesLoading,
    conversationLoading,
    updateConversationStatus,
  } = useMessage(conversationId);

  useAutosizeTextArea(textAreaRef.current, content);

  const scrollToBottom = () => {
    if (newMessageRef.current)
      newMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    else
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages[0]]);

  if (messagesLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        Fetching data...
      </div>
    );
  }

  return (
    <>
      <Navigation
        text={`Anonn chat with ${conversation?.title}`}
        src="https://api"
      >
        <div ref={scrollRef} className="py-16 px-2 max-w-[400px] mx-auto">
          {messages?.map((msg) => {
            if (msg.id === 'newMessageLabel') {
              return (
                <div ref={newMessageRef} className="text-center">
                  You have some new messages
                </div>
              );
            }

            return (
              <MessageBox
                id={msg.id}
                key={msg.id}
                isMine={msg.isMine}
                message={msg.content}
              />
            );
          })}
          <div style={{ marginBottom: 30 }} ref={messagesEndRef} />
        </div>
        <div className="flex justify-center focus:outline-0">
   <div className="fixed py-8 bottom-[-40px] max-w-[400px] flex mx-auto text-center justify-center focus:outline-0">
          <div className="relative bottom-0 focus:outline-0">
            {conversation?.status && (
              <>
                <textarea
                  className="border-0 pl-8 pr-16 focus:outline-0"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="type something, durh"
                  ref={textAreaRef}
                  rows={1}
                  value={content}
                />
                {content.length > 0 && (
                  <button
                    className="absolute right-4 h-[100%]"
                    disabled={sendingMessage}
                    onClick={() => {
                      sendMessage(content);
                      setContent('');
                      scrollToBottom();
                    }}
                  >
                    <SendIcon />
                  </button>
                )}
              </>
            )}

            {/* {conversation?.status === 'PENDING' && (
              <div className="flex mx-auto justify-evenly items-center">
                <Button
                  text="Accept"
                  bg="bg_yellow"
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg"
                  onClick={() => updateConversationStatus('approve')}
                />

                <Button
                  text="Nayy"
                  bg="bg_black"
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg"
                  onClick={() => updateConversationStatus('reject')}
                />
              </div>
            )} */}
          </div>
        </div>
        </div>
     
      </Navigation>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination } = profileService.validateUserProfile(ctx);

  if (redirectionDestination)
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  return {
    props: {
      conversationId: ctx.params?.id as string,
    },
  };
}
