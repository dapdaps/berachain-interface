import { toast } from 'react-toastify';
import Toast from '@/components/toast';

// 3s
const ToastAutoCloseDuration = 3000;

export default function useToast() {
  const success = (params: any) => {
    return toast(<Toast type="success" duration={ToastAutoCloseDuration} {...params} />, {
      position: 'top-right',
      autoClose: ToastAutoCloseDuration,
    });
  };
  const fail = (params: any) => {
    return toast(<Toast type="error" duration={ToastAutoCloseDuration} {...params} />, {
      position: 'top-right',
      autoClose: ToastAutoCloseDuration,
    });
  };
  const info = (params: any) => {
    return toast(<Toast type="info" duration={ToastAutoCloseDuration} {...params} />, {
      position: 'top-right',
      autoClose: ToastAutoCloseDuration,
    });
  };
  const loading = (params: any) => {
    return toast(<Toast type="pending" duration={ToastAutoCloseDuration} {...params} />, {
      position: 'top-right',
      autoClose: ToastAutoCloseDuration,
    });
  };
  return {
    success,
    fail,
    info,
    loading,
    dismiss: toast.dismiss,
  };
}

export function formatContractRejectedError(error: any, defaultMsg?: string): string {
  if (error?.message?.includes('user rejected transaction')) {
    return 'User rejected transaction';
  }
  return defaultMsg || '';
}
