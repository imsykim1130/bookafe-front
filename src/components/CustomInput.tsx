import { Input } from '@/components/ui/input.tsx';

interface Props {
  type: string;
  placeholder: string;
  id: string;
  name: string;
}

const CustomInput = (props: Props) => {
  const { type, placeholder, id } = props;
  return <Input id={id} type={type} placeholder={placeholder} />;
};

export default CustomInput;
