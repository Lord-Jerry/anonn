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
      <div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600">
        <input
          id={props.id}
          type={props.type}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          className="block w-full border-0 border-b border-transparent bg-gray-50 text-black focus:border-indigo-600 focus:ring-0 sm:text-sm"
        />
      </div>
    </div>
  );
}
