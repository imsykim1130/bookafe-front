import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function AlertDialogComp({children, logoutClickHandler}: { children?: React.ReactNode, logoutClickHandler: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[24rem]'>
        <AlertDialogHeader>
          <AlertDialogDescription className='text-black'>
            정말 로그아웃 하시겠습니까? 🥲
          </AlertDialogDescription>
        </AlertDialogHeader>
        <>
          <AlertDialogCancel>돌아가기</AlertDialogCancel>
          <AlertDialogAction onClick={logoutClickHandler}>로그아웃</AlertDialogAction>
        </>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDialogComp;
