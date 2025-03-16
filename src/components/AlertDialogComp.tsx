import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function AlertDialogComp({
  children,
  message,
  onConfirmClick,
}: {
  children?: React.ReactNode;
  message: string;
  onConfirmClick: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-[24rem]">
        <AlertDialogHeader>
          <AlertDialogDescription className="text-black">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <>
          <AlertDialogCancel>아니오</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmClick}>네</AlertDialogAction>
        </>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDialogComp;
