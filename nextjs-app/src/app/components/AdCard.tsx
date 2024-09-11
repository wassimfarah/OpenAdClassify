'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

// Define TypeScript interface for media and ad props
interface Media {
  b64: string; // Base64 string for image
}

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  mediaData: Media[]; // Array of media objects with base64 data
}

interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  // Placeholder image path
  const placeholderImage = '/images/adCardPH.png';

  // Handle base64 image data or use placeholder
  const imageSrc = ad.mediaData.length > 0 && ad.mediaData[0].b64 
    ? `data:image/png;base64,${ad.mediaData[0].b64}` 
    : placeholderImage;

  return (
    <Card className="mb-4">
      {/* Display the ad image or a placeholder if the image is missing */}
      <Card.Header>{ad.type}</Card.Header>
      <Card.Img
        variant="top"
        src={imageSrc}
        alt={ad.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{ad.title}</Card.Title>
        <Card.Text>
          <strong>Price:</strong> ${ad.price}
        </Card.Text>
        <Card.Text>
          <strong>Location:</strong> {ad.location}
        </Card.Text>
        <Link href={`/ads/${ad.id}`} passHref>
          <Button variant="primary">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default AdCard;
