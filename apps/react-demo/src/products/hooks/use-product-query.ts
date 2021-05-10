import { useRouter } from 'next/router';

export function useProductQuery(): string | false {
  const router = useRouter();

  if (!router.isReady) {
    return false;
  }

  return router.query.id as string;
}
