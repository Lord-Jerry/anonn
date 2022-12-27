import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Button from "components/button";
import { myLoader } from "utils/imageLoader";
import ConversationService from "services/conversation";
import Navigation from "components/Navigation";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import useAutosizeTextArea from "utils/useAutosizeTextArea";
import SendIcon from "icon/SendIcon";
import { timeSort } from "utils/timeSort";
interface userDataObj {
  id: string;
  content: string;
}

export default function SingleConversation() {
  const queryClient = new QueryClient();
  const [content, setContent] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, content);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(evt.target?.value);
  };

  const conversationService = new ConversationService();
  const router = useRouter();

  const userData : userDataObj | any = router?.query;

  const contentData: {id: string, content: string} = {
    id: userData?.id,
    content: content,
  };

  const { isLoading, data } = useQuery(
    ["singleConversations", userData?.id],

    () => conversationService.getSingleConversation(userData?.id),
    {
      enabled: !!userData?.id,
    }
  );

  const { isLoading: sendingMessage, mutate } = useMutation(
    ()=> conversationService.sendMessage(contentData),
    {
      onSuccess(data) {
        console.log(data);
        queryClient.invalidateQueries(["singleConversations"]);
        setContent("");
      },
      onError(data) {
        console.log(data);
      },
    }
  );
  const sortedData = data?.sort(timeSort);
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center h-[600px]">
          Fetching data...
        </div>
      )}
      {!isLoading && data && (
        <Navigation text={`Anonn chat with ${userData?.username}`}>
          <div className="py-16 px-2 w-[400px]">
            {sortedData?.map((msg: any) => (
              <div key={msg?.id}>
                {msg?.isMine && (
                  <div className="bg-[url('/images/mymessage.svg')] bg-no-repeat bg-right ml-auto w-[290px]">
                    <p className="break-words py-4 text-white bg-[##1E1E1E] mr-5 my-4 px-4 border-2 border-[#f8f886] rounded-lg">
                      {msg?.content}
                    </p>
                  </div>
                )}
                {!msg?.isMine && (
                  <div className="bg-[url('/images/theirmessage.svg')] bg-no-repeat bg-left w-[290px]">
                    <p className="break-words py-4 text-black bg-[#f8f886] ml-4 my-4 px-4 rounded-lg">
                      {msg?.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="fixed py-8 bottom-[-40px] w-full">
            <div className="relative bottom-0">
              <textarea
                className="border-0"
                onChange={handleChange}
                placeholder="type something, durh"
                ref={textAreaRef}
                rows={1}
                value={content}
              />
              <button className="absolute right-2 h-[100%]" onClick={() => mutate()}>
                <SendIcon />
              </button>
            </div>
          </div>
        </Navigation>
      )}
    </>
  );
}
