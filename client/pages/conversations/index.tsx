import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next/types';

import Tab from 'components/tab';
import Empty from 'components/Empty';
import MessageBox from 'components/ConversationBox';
import Navigation from 'components/Navigation';
import { RequestIcon } from 'icon/RequestIcon';

import ConversationService, { ConversationType } from 'services/conversation';
import ProfileService from 'services/profile';
import { conversationTabs } from 'constants/tabs';
import { markTabAsSelected } from 'utils/tabs';

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType['props'];
type ConversationsProps = {
  isLoading: boolean;
  conversations: ConversationType[];
  onSelect: (id: string) => void;
};
const Conversations = (props: ConversationsProps) => {
  if (props.isLoading) {
    return <p>Loading...</p>;
  }

  if (props.conversations.length === 0) {
    return (
      <Empty
        text="you don’t have anything going on"
        link="https://copy"
        icon={<RequestIcon />}
      />
    );
  }

  return (
    <>
      {props.conversations.map((conversation) => (
        <MessageBox
          onSelect={props.onSelect}
          avatar={conversation.avatar}
          username={conversation.title}
          id={conversation.conversationId}
          key={conversation.conversationId}
          msg={conversation.lastMessage.content}
          time={conversation.lastMessage.sentAt}
        />
      ))}
    </>
  );
};

export default function Dashboard(props: Props) {
  // conversation shouldn't contain more than 20 items at a time
  // for every x amount of newly added data, we should remove X amount of data from the end
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [tabs, setTabs] = useState(
    markTabAsSelected(conversationTabs, (props?.tab as string) || undefined)
  );
  const selectedTab = tabs.find((x) => x.selected) || tabs[1];
  const conversationService = new ConversationService();

  const { isLoading } = useQuery(
    ['userConversations', selectedTab.id],
    () => conversationService.getAllConversations(selectedTab.id),
    {
      onSuccess: (data) => setConversations(data),
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retryDelay: 3000,
    }
  );

  const handleTabClick = (id: string) => {
    setTabs((prev) => markTabAsSelected(prev, id));
    Router.push(
      {
        query: {
          tab: id,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const handleConversationClick = (id: string) => {
    Router.push({
      pathname: `/conversations/${id}`,
      query: { id },
    });
  };

  useEffect(() => {
    if (isLoading) return;
    const intervalId = setInterval(() => {
      const latestConversations = conversations[0];
      if (!latestConversations) return;
      conversationService
        .getAllConversations(
          selectedTab.id,
          latestConversations.updatedAt,
          'latest'
        )
        .then((data) => {
          setConversations((prev) => {
            const maxConversations = 20;
            const numberOfConversationToRemove = data.length;
            // find better solution that doesn't involve mutating the array
            prev.splice(
              maxConversations - numberOfConversationToRemove,
              numberOfConversationToRemove
            );
            return [...data, ...prev];
          });
        });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [conversations]);

  return (
    <>
      <Navigation text="Conversations" />
      <div className="pt-12">
        <Tab tabs={tabs} onSelect={handleTabClick} />
      </div>
      <Conversations
        isLoading={isLoading}
        conversations={conversations || []}
        onSelect={handleConversationClick}
      />
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
      tab: ctx.query.tab || null,
    },
  };
}
