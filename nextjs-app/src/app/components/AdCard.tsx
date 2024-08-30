'use client';

import React from 'react';
import Link from 'next/link'; 
import { Card, Button } from 'react-bootstrap';

// Define TypeScript interface for ad props
interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string; 
  imageUrl: string; 
}

interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  // Placeholder image path
  const placeholderImage = '/images/adCardPH.png';

  return (
    <Card className="mb-4">
      {/* Display the ad image or a placeholder if the image is missing */}
      <Card.Header>{ad.type}</Card.Header>
      <Card.Img
        variant="top"
        src={ad.imageUrl || placeholderImage}
        alt={ad.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{ad.title}</Card.Title>
        <Card.Text>
          {ad.description}
        </Card.Text>
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
