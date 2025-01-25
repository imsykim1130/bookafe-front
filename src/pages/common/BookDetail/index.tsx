import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserItem } from '../../../api/item.ts';
import CommentSection from './CommentSectioin';
import BookSection from './BookSection';
import { useState } from 'react';

const BookDetail = () => {
  const { isbn } = useParams();
  const { role } = useSelector((state: { user: UserItem }) => state.user);
  const [bookLoading, setBookLoading] = useState<boolean>(false);

  const bookLoadingComplete = () => {
    setBookLoading(true);
  };

  return (
    <main>
      <BookSection isbn={isbn} role={role} bookLoadingComplete={bookLoadingComplete} />
      <CommentSection bookLoading={bookLoading} />
    </main>
  );
};

export default BookDetail;
