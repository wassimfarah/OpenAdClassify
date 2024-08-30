// app/ads/[id]/page.tsx
'use client';

import React from 'react';
import AdDetails from '@/app/components/AdDetails';

const AdDetailsPage = ({ params }: { params: { id: string } }) => {
    // Pass the `id` to the AdDetails component
    return <AdDetails adId={params.id} />;
  };
  
  export default AdDetailsPage;