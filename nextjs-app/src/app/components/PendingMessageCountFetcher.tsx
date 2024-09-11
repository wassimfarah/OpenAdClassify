import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { apiRequest } from '@/utils/axiosApiRequest';
import { setPendingMessageCount } from '@/Redux/pendingMessageSlice';
 
const PendingMessageCountFetcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPendingMessageCount = async () => {
      try {
        const data = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_PENDING_MESSAGES_COUNT}`,
          useCredentials: true,
        });

        if (data) {
          dispatch(setPendingMessageCount(data.data.count));
        }
      } catch (error) {
      }
    };

    fetchPendingMessageCount();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default PendingMessageCountFetcher;
