import { useEffect, useRef, useState } from "react";
import Navigation from "components/Navigation";
import useAutosizeTextArea from "utils/useAutosizeTextArea";
import SendIcon from "icon/SendIcon";

import MessageBox from "components/MessageBox";
import { GetServerSidePropsContext } from "next";
import ProfileService from "services/profile";
import useMessage from "hooks/useMessage";
import Button from "components/button";

export default function SingleConversation({
  conversationId,
}: {
  conversationId: string;
}) {
  const newMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState<string>("");

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
        behavior: "auto",
      });
    else
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages[0]]);

  if (messagesLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        Loading...
      </div>
    );
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.shiftKey && event.key === "Enter") return;
    if (event.key === "Enter") {
      sendMessage(content);
      setContent("");
      scrollToBottom();
    }
  };

  return (
    <>
      <Navigation
        text={`Anonn chat with ${conversation?.title}`}
        src={conversation?.avatar}
      >
        <div
          ref={scrollRef}
          className="py-16 px-2 min-[600px]:w-[600px] w-full mx-auto"
        >
          {messages?.map((msg) => {
            if (msg.id === "newMessageLabel") {
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
          {conversation?.status === "PENDING" && (
            <div className="mx-auto h-[300px] bg-red-400 p-12 w-full">
              <p>
                This is your first conversation with anonn user, please accept
                to continue or reject to end this chat without replying
              </p>
              <div className="flex justify-between items-center">
                <Button
                  text="Accept"
                  bg="bg_yellow"
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg mx-2"
                  onClick={() => updateConversationStatus("approve")}
                />

                <Button
                  text="Nayy"
                  bg="bg_black"
                  className="mt-12 flex justify-center items-center p-4 w-full rounded-lg mx-2"
                  onClick={() => updateConversationStatus("reject")}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center focus:outline-0">
          <div className="fixed py-8 bottom-[-40px] min-[600px]:w-[600px] w-[100vw] flex mx-auto text-center justify-center focus:outline-0">
            <div className="relative bottom-0 focus:outline-0">
              {conversation?.status === "ACTIVE" && (
                <>
                  <textarea
                    className="border-0 pl-8 pr-16 min-[600px]:w-[600px] w-[100vw] py-6"
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
                      onClick={() => {
                        sendMessage(content);
                        setContent("");
                        scrollToBottom();
                      }}
                    >
                      <SendIcon />
                    </button>
                  )}
                </>
              )}
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
