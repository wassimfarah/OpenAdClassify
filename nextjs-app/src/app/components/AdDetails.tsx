'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/axiosApiRequest';
import { Carousel } from 'react-bootstrap';

interface AdDetailsProps {
  adId: string;
}

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  acceptOffer: boolean;
  acceptMessages: boolean;
  acceptExchange: boolean;
  location: string;
  adStatus: string;
  categoryId: string;
  subcategoryId: string;
  createdBy: {
    id: number;
    phoneNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  media: { url: string }[];
  numberOfImpressions: number;
}

const AdDetails: React.FC<AdDetailsProps> = ({ adId }) => {
  const router = useRouter();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const placeholderImage = '/images/adCardPH.png';

  useEffect(() => {
    if (!adId) return;

    const fetchAdDetails = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_AD}/${adId}`,
          useCredentials: true,
        });
        setAd(response.data);
      } catch (error) {
        setError('Error fetching ad details');
        console.error('Error fetching ad details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <button className="btn btn-secondary mb-4" onClick={() => router.back()}>
        Back
      </button>

      {ad && (
        <div className="row d-flex align-items-stretch">
          {/* Ad Title */}
          <h2 className="mb-4 text-center">{ad.title}</h2>

          {/* Carousel Column */}
          <div className="col-md-6 mb-4 d-flex">
            <Carousel className="w-100 border rounded" style={{ borderWidth: '1px' }}>
              {ad.media.length > 0 ? (
                ad.media.map((mediaItem, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={mediaItem.url || placeholderImage}
                      alt={`Slide ${index + 1}`}
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={placeholderImage}
                    alt="Placeholder"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </Carousel.Item>
              )}
            </Carousel>
          </div>

          {/* Ad Details Column */}
          <div className="col-md-6 d-flex p-0 m-0">
            <div className="card w-100">
              <div className="card-body">
                <h5 className="card-title">Details</h5>
                <p className="card-text">{ad.description}</p>
                <p><strong>Location:</strong> {ad.location}</p>
                <p><strong>Type:</strong> {ad.type}</p>
                <p><strong>Price:</strong> ${ad.price}</p>
                {ad.acceptMessages && (
                  <>
                    <p><strong>Contact:</strong></p>
                    <button className="btn btn-primary mb-2">Send Message</button>
                  </>
                )}
                <div>
                  <p><strong>Phone:</strong> {ad.createdBy.phoneNumber}</p> {/* Display phone number */}
                  <button className="btn btn-success">Contact via WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetails;
