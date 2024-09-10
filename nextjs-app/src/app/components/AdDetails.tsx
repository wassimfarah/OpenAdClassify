'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/utils/axiosApiRequest';
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { setSelectedConversationId } from '@/Redux/conversationSlice';

interface Media {
  b64: string;
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
  mediaData: Media[];
  numberOfImpressions: number;
}

const AdDetails: React.FC<{ adId: string }> = ({ adId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  
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
        setAd(response.data.ad);  
      } catch (error) {
        setError('Error fetching ad details');
        console.error('Error fetching ad details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [adId]);

  const handleContactClick = async () => {
    if (!ad) return;
    try {
      const response = await apiRequest({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL_CREATE_OR_FIND_CONVERSATION}`,
        useCredentials: true,
        data: {
          userIds: ad.createdBy.id,
          adId: ad.id,
        },
      });
      const conversation = response.data.conversation;
  
      dispatch(setSelectedConversationId(conversation.id));
      router.push('/messages');
    } catch (error) {
      if (!user){ // user not logged in.
        router.push('/login');
      } else {
        console.error('Error starting conversation:', error);
        setError('Failed to start a conversation. Please try again.');
      }

    }
  };

  if (loading) return <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-4" onClick={() => router.back()}>
        Back
      </button>

      {ad && (
        <div className="row d-flex align-items-stretch">
          <h2 className="mb-4 text-center"><strong>{ad.title}</strong></h2>

          <div className="col-md-6 mb-4 d-flex">
            <Carousel className="w-100 border rounded" style={{ borderWidth: '1px' }}>
              {ad.mediaData.length > 0 ? (
                ad.mediaData.map((mediaItem, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={mediaItem.b64 ? `data:image/png;base64,${mediaItem.b64}` : placeholderImage}
                      alt={`Ad media ${index + 1}`}
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
                    <button disabled={user?.sub === ad.createdBy.id} onClick={handleContactClick} className="btn btn-primary mb-2">Send Message</button>
                  </>
                )}
                <div>
                  <p><strong>Username: </strong>{ad.createdBy.username}</p>
                  <p><strong>Phone:</strong> {ad.createdBy.phoneNumber}</p>
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
