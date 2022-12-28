type Props = {
  id: string;
  isMine: boolean;
  message: string;
};

const messageTypes = {
  mine: {
    bg: "bg-[url('/images/mymessage.svg')] bg-no-repeat bg-right ml-auto max-w-[290px]",
    content:
      'break-words py-4 text-white bg-[##1E1E1E] mr-5 my-4 px-4 border-2 border-[#f8f886] rounded-lg',
  },
  theirs: {
    bg: "bg-[url('/images/theirmessage.svg')] bg-no-repeat bg-left max-w-[290px]",
    content:
      'break-words py-4 text-black bg-[#f8f886] ml-4 my-4 px-4 rounded-lg',
  },
};

export default function MessageBox(props: Props) {
  const { bg, content } = messageTypes[props.isMine ? 'mine' : 'theirs'];
  return (
    <div accessKey={props.id} className={bg}>
      <p className={content}>{props.message}</p>
    </div>
  );
}
