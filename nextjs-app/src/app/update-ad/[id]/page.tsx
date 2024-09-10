'use client';

import React, { useEffect, useState } from 'react';
import CreateAdForm from '@/app/components/CreateAdForm';
import { apiRequest } from '@/utils/axiosApiRequest';

const AdPage = ({ params }: { params: { id: string } }) => {
  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null);

  useEffect(() => {
    console.log(params.id)
    const fetchAdData = async () => {
        console.log("params.id: ",params.id)
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_AD}/${params.id}`,
        });
        setInitialData(response.data.ad);
        console.log(response.data.ad.mediaData)
      } catch (error) {
        console.error('Error fetching ad data:', error);
      }
    };

    if (params.id) {
      fetchAdData();
    }
  }, [params.id]);

  return (
    <div className="container mt-4">
      <h1>{params.id ? 'Update Ad' : 'Create Ad'}</h1>
      <CreateAdForm adId={params.id} initialData={initialData} />
    </div>
  );
};

export default AdPage;
