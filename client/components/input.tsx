type Props = {
  name: string;
  type: "text" | "password" | "email";
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input(props: Props) {
  return (
    <div>
      <div className="mt-1 border-b border-gray-30">
        <input
          id={props.id}
          type={props.type}
          name={props.name}
          value={props.value}
          autoComplete={"false"}
          onChange={props.onChange}
          placeholder={props.placeholder} 
          role="textbox"
          className="input block w-full border-0 border-b border-transparent bg-gray-50 text-black sm:text-sm"
        />
      </div>
    </div>
  );
}
