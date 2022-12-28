import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next/types';

import Tab from 'components/tab';
import Empty from 'components/Empty';
import ConversationBox from 'components/ConversationBox';
import Navigation from 'components/Navigation';
import { RequestIcon } from 'icon/RequestIcon';

import ConversationService, { ConversationType } from 'services/conversation';
import ProfileService from 'services/profile';
import { conversationTabs } from 'constants/tabs';
import { markTabAsSelected } from 'utils/tabs';

import useScroll from 'hooks/useScroll';

type GetServerSidePropsReturnType = Awaited<
  ReturnType<typeof getServerSideProps>
>;
type Props = GetServerSidePropsReturnType['props'];
type ConversationsProps = {
  username?: string;
  isLoading: boolean;
  conversations: ConversationType[];
  onSelect: (id: string) => void;
};
const Conversations = (props: ConversationsProps) => {
  if (props.isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        Loading...
      </div>
    );
  }

  if (props.conversations.length === 0) {
    console.log(props.username)
    return (
      <Empty
        text="you don’t have anything going on"
        link={`https://anonn.xyz/profile/${props?.username}`}
        icon={<RequestIcon />}
      />
    );
  }

  return (
    <>
      {props.conversations.map((conversation) => (
        <ConversationBox
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
  const [scrollLoading, setScrollLoading] = useState(false);
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

  const handleScrollfetch = async (scrolltype?: string) => {
    if (isLoading || scrollLoading) return;

    const latestConversations = conversations[conversations.length - 1];
    if (scrolltype === 'up' || !latestConversations) return;

    setScrollLoading(true);
    const oldConversations = await conversationService.getAllConversations(
      selectedTab.id,
      latestConversations.updatedAt
    );

    setConversations((prev) => {
      return uniqBy([...prev, ...oldConversations], 'conversationId');
    });
    setScrollLoading(false);
  };

  const handleConversationClick = (id: string) => {
    Router.push({
      pathname: `/conversations/${id}`,
      query: { id },
    });
  };

  const { ref } = useScroll((pos) => handleScrollfetch(pos));

  useEffect(() => {
    if (isLoading) return;
    const intervalId = setInterval(async () => {
      const latestConversations = conversations[0];
      if (!latestConversations) return;

      const newConversations = await conversationService.getAllConversations(
        selectedTab.id,
        latestConversations.updatedAt,
        'latest'
      );

      setConversations((prev) => {
        return uniqBy([...newConversations, ...prev], 'conversationId');
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [conversations]);

  return (
    <>
      <Navigation text="Conversations" />
      <div className="pt-12">
        <Tab tabs={tabs} onSelect={handleTabClick} />
      </div>
      <div ref={ref}>
        <Conversations
          isLoading={isLoading}
          conversations={conversations || []}
          onSelect={handleConversationClick}
        />
        <div className="flex justify-center items-center pt-2">
          {scrollLoading ? 'loading' : null}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const profileService = new ProfileService();
  const { redirectionDestination, username } = profileService.validateUserProfile(ctx);

  if (redirectionDestination)
    return {
      redirect: {
        destination: redirectionDestination,
      },
    };

  return {
    props: {
      username,
      tab: ctx.query.tab || null,
    },
  };
}
