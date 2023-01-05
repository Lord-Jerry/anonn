import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { useEffect, useRef, useState } from "react";

import Navigation from "components/Navigation";
import MessageBox from "components/MessageBox";
import Button from "components/button";
import Loader from "components/Loader";

import ProfileService from "services/profile";
import useMessage from "hooks/useMessage";
import ChatTextArea from "components/ChatTextarea";

export default function SingleConversation({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const newMessageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    scrollRef,
    sendMessage,
    conversation,
    sendingMessage,
    messagesLoading,
    updateConversationStatus,
  } = useMessage(conversationId);

  const conversationStatus = useRef(conversation?.status);

  const scrollToBottom = (newMessage = false) => {
    if (newMessageRef?.current && !newMessage) {
      newMessageRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    } else if (messagesEndRef?.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
      });
    }
  };

  useEffect(() => {
    // refs don't seem to be available when the useEffect is called
    setTimeout(() => scrollToBottom(), 500);
  }, [messagesLoading]);

  if (messagesLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader />
      </div>
    );
  }

  const handleBackButton = () => {
    const status = conversationStatus.current || conversation?.status;
    if (status === "PENDING") {
      router.push("/conversations?tab=pending");
    } else if (status === "ACTIVE") {
      router.push("/conversations?tab=active");
    } else if (status === "REJECTED") {
      router.push("/conversations?tab=pending");
    } else {
      router.push("/conversations");
    }
  };

  return (
    <>
      <Navigation
        title={`Anonn chat with ${conversation?.title}`}
        imgSrc={conversation?.avatar}
        backButton={{
          disable: false,
          onClick: handleBackButton,
        }}
      >
        <div
          ref={scrollRef}
          className="py-16 px-2 min-[600px]:w-[600px] w-full mx-auto"
        >
          {messages?.map((msg) => {
            if (msg.id === "newMessageLabel") {
              return (
                <div key={msg.id} ref={newMessageRef} className="text-center">
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
                time={msg.updatedAt}
              />
            );
          })}
          <div style={{ marginBottom: 30 }} ref={messagesEndRef} />
          {conversation?.status === "PENDING" && (
            <div className="mx-auto fixed bottom-0 h-[132px] bg-[#1E1E1E] px-8 min-[600px]:w-[600px] w-full">
              <p className="text-xs opacity-70 py-3 text-white text-center">
                This is your first conversation with anonn user, please accept
                to continue or reject to end this chat without replying
              </p>
              <div className="flex justify-between pb-2">
                <Button
                  text="Yayy, continue"
                  bg="bg_yellow"
                  className="text-xs mt-2 flex justify-center items-center px-4 py-2 w-full rounded-lg mr-2"
                  onClick={() => {
                    conversationStatus.current = conversation?.status;
                    updateConversationStatus("approve");
                  }}
                />
                <Button
                  text="Nayy, I’d pass"
                  bg="bg_black"
                  className="text-xs mt-2 flex justify-center items-center px-4 py-2 w-full rounded-lg ml-2 border-2 border-[#f8f886]"
                  onClick={() => {
                    conversationStatus.current = conversation?.status;
                    updateConversationStatus("reject");
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <ChatTextArea
          conversation={conversation}
          sendMessage={sendMessage}
          sendingMessage={sendingMessage}
          scrollToBottom={scrollToBottom}
        />
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
