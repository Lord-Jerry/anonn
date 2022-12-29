import Navigation from 'components/Navigation';
import pageContent from 'constants/pageContent';
import { Logo } from 'icon/logo';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

type GetStaticPropsReturnType = Awaited<ReturnType<typeof getStaticProps>>;
type Props = GetStaticPropsReturnType['props'];

export default function Privacy(props: Props) {
  const router = useRouter();
  const { title, content } =
    pageContent[props?.page as keyof typeof pageContent];
  return (
    <>
      <Head>
        <title>Anonn</title>
        <meta property="title" content="Anonn" />
        <meta property="og:title" content="Anonn" />
        <meta
          property="description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
        <meta
          property="og:description"
          content="Chat as Anonn. Nobody would know. Share polls and vote anonymously. Share with mask on. Censored"
        />
      </Head>
      <Navigation
        title={title}
        backButton={{
          disable: false,
          onClick: () => router.push('/'),
        }}
      >
        <div className="min-[600px]:w-[400px] mx-auto text-sm font-normal mx-[37px] my-14 px-auto leading-normal pt-4 overflow-scroll">
          <Logo />
          <h2 className="font-bold py-8">{title}</h2>
          {content}
        </div>
      </Navigation>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(pageContent).map((page) => ({
      params: { page },
    })),
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const page = ctx.params?.page;
  if (!page)
    return {
      redirect: {
        destination: '/',
      },
    };

  return {
    props: {
      page,
    },
  };
}
