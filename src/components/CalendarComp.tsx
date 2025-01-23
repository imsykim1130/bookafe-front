import { Dispatch, SetStateAction } from 'react';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

interface Props {
  date: DateValueType;
  setDate: Dispatch<SetStateAction<DateValueType>>;
}

const CalendarComp = ({ date, setDate }: Props) => {
  return <Datepicker value={date} onChange={(newValue) => setDate(newValue)} useRange={false} />;
};

export default CalendarComp;
