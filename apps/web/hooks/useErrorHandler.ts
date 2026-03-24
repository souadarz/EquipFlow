import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export function useErrorHandler() {
    return (error: unknown) => {
        if (error instanceof AxiosError) {
            const message = error.response?.data?.message;
            if (Array.isArray(message)) {
                message.forEach((m: string) => toast.error(m));
            } else {
                toast.error(message ?? 'Une erreur est survenue');
            }
        } else {
            toast.error('Une erreur inattendue est survenue');
        }
    };
}