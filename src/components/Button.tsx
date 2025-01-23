interface Props {
  name: string;
  bgColor: 'bg-black' | 'bg-white';
  bgOpacity: 40 | 60 | 80 | 100;
  bgHoverOpacity: 40 | 60 | 80 | 100;
  textColor: 'text-white' | 'text-light-black' | 'text-dark-black' | 'text-default-black';
  textSize: 'sm' | 'md' | 'lg';
}

const CustomButton = (props: Props) => {
  const { bgColor, bgOpacity, bgHoverOpacity, textColor, textSize, name } = props;

  const bgHoverOpacityText = (bgHoverOpacity: number) => {
    if (bgHoverOpacity === 40) {
      return 'hover:bg-opacity-40';
    }
    if (bgHoverOpacity === 60) {
      return 'hover:bg-opacity-60';
    }
    if (bgHoverOpacity === 80) {
      return 'hover:bg-opacity-80';
    }
    if (bgHoverOpacity === 100) {
      return 'hover:bg-opacity-100';
    }
  };

  const bgOpacityText = (bgOpacity: number) => {
    if (bgOpacity === 40) {
      return 'bg-opacity-40';
    }
    if (bgOpacity === 60) {
      return 'bg-opacity-60';
    }
    if (bgOpacity === 80) {
      return 'bg-opacity-80';
    }
    if (bgOpacity === 100) {
      return 'bg-opacity-100';
    }
  };

  return (
    <button
      className={`w-full py-[16px] rounded-[5px] ${textColor} text-${textSize} ${bgColor} ${bgOpacityText(bgOpacity)} ${bgHoverOpacityText(bgHoverOpacity)} duration-300`}
    >
      {name}
    </button>
  );
};

export default CustomButton;
