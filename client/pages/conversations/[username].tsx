import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import ConversationService from "services/conversation";
import Navigation from "components/Navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAutosizeTextArea from "utils/useAutosizeTextArea";
import SendIcon from "icon/SendIcon";
import { timeSort } from "utils/timeSort";
interface userDataObj {
  id: string;
  content: string;
}

export default function SingleConversation() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState<string>("");
  const messagesEndRef = useRef<any>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, content);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(evt.target?.value);
  };

  const conversationService = new ConversationService();
  const router = useRouter();

  const userData: userDataObj | any = router?.query;

  const contentData: { id: string; content: string } = {
    id: userData?.id,
    content: content,
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { isLoading, data } = useQuery(
    ["singleConversations", userData?.id],

    () => conversationService.getSingleConversation(userData?.id),
    {
      enabled: !!userData?.id,
    }
  );

  const { isLoading: sendingMessage, mutate } = useMutation(
    () => conversationService.sendMessage(contentData),
    {
      onSuccess(data) {
        console.log(data);
        queryClient.invalidateQueries(["singleConversations"]);
        textAreaRef.current?.focus();
      },
      onError(data) {
        console.log(data);
      },
    }
  );
  const sortedData = data?.sort(timeSort);

  useEffect(() => {
    scrollToBottom();
  }, [sortedData]);
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center h-[600px]">
          Fetching data...
        </div>
      )}
      {!isLoading && data && (
        <Navigation
          text={`Anonn chat with ${userData?.username}`}
          src="https://api"
        >
          <div className="py-16 px-2 max-w-[400px] mx-auto">
            {sortedData?.map((msg: any) => (
              <div key={msg?.id}>
                {msg?.isMine && (
                  <div className="bg-[url('/images/mymessage.svg')] bg-no-repeat bg-right ml-auto max-w-[290px]">
                    <p className="break-words py-4 text-white bg-[##1E1E1E] mr-5 my-4 px-4 border-2 border-[#f8f886] rounded-lg">
                      {msg?.content}
                    </p>
                  </div>
                )}
                {!msg?.isMine && (
                  <div className="bg-[url('/images/theirmessage.svg')] bg-no-repeat bg-left max-w-[290px]">
                    <p className="break-words py-4 text-black bg-[#f8f886] ml-4 my-4 px-4 rounded-lg">
                      {msg?.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {/* {sortedData[0]?.isNewMessage && (
            <p className="text-center">You have some new messages</p>
            )} */}
            <div style={{ marginBottom: 30 }} ref={messagesEndRef} />
          </div>
          <div className="fixed py-8 bottom-[-40px] max-w-[400px] flex justify-center">
            <div className="relative bottom-0">
              <textarea
                className="border-0"
                onChange={handleChange}
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
                    mutate();
                    setContent("");
                    scrollToBottom();
                  }}
                >
                  <SendIcon />
                </button>
              )}
            </div>
          </div>
        </Navigation>
      )}
    </>
  );
}
