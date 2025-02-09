import { useParams } from 'react-router-dom';
import CommentSection from './CommentSectioin';
import BookSection from './BookSection';
import { useState } from 'react';
import { useUserStore } from '@/zustand/userStore.ts';

const BookDetail = () => {
  const { isbn } = useParams();
  const {user, loading, error} = useUserStore();
  const [bookLoading, setBookLoading] = useState<boolean>(false);

  const bookLoadingComplete = () => {
    setBookLoading(true);
  };

  return (
    <main>
      <BookSection isbn={isbn} role={user && !error && !loading ? user.role : "ROLE_USER"} bookLoadingComplete={bookLoadingComplete} />
      <CommentSection bookLoading={bookLoading} />
    </main>
  );
};

export default BookDetail;
