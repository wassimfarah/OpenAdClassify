'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/utils/axiosApiRequest';
import AdCard from './AdCard';

// Define TypeScript interfaces for the ad
interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string; 
  imageUrl: string; 
}

const Ads: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_AD}`,
          useCredentials: false,
        });
        setAds(response.data);
      } catch (error) {
        setError('Error fetching ads');
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1 className="my-4">Ads</h1>
      <div className="row">
        {ads.map(ad => (
          <div className="col-md-4 mb-4" key={ad.id}>
            <AdCard ad={ad} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ads;
