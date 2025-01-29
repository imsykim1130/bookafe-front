import moment from 'moment';

interface DateInputProps {
  defaultDate?: Date;
  date: Date;
  setDate: (date: Date) => void;
}

const DateInput = (props: DateInputProps) => {
  const { date, setDate, defaultDate } = props;
  return (
    <input
      type="date"
      value={moment(date).format('yyyy-MM-DD')} // yyyy-MM-DD 형식으로 넣어주어야 한다
      className="px-3 py-1.5 bg-white border border-gray-200 rounded-[10px]"
      onChange={(e) => {
        if (!e.target.value) {
          setDate(defaultDate ? defaultDate : new Date());
          return;
        }
        const date = new Date(e.target.value);
        setDate(date);
      }}
    />
  );
};

export default DateInput;
