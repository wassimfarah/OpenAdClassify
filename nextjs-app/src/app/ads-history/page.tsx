'use client'; 

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { apiRequest } from '../../utils/axiosApiRequest';
import { useRouter } from 'next/navigation';
import { Card, Button, Container, Row, Col, Spinner, Alert, ButtonGroup, Modal } from 'react-bootstrap';
import { PencilSquare, Trash, Eye } from 'react-bootstrap-icons';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  adStatus: string;
}

const AdsHistory = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_USER_ADS_BY_ID}`,
          useCredentials: true,
        });

        if (response?.data) {
          setAds(response.data.ads); 
        } else {
          setError('Failed to fetch ads.');
        }
      } catch (error) {
        setError('Error fetching ads: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [user]);

  const handleAdSelect = (ad: Ad) => {
    setSelectedAd(ad);
    setSuccess(null); // Clear any previous success message
  };

  const handleBrowse = () => {
    if (selectedAd) {
      router.push(`/ads/${selectedAd.id}`); // Navigate to ad details page
    } else {
      alert('Please select an ad to browse.');
    }
  };

  const handleEdit = () => {
    if (selectedAd) {
      router.push(`/update-ad/${selectedAd.id}`); // Navigate to edit ad page
    } else {
      alert('Please select an ad to edit.');
    }
  };

  const handleDelete = async () => {
    if (!selectedAd) {
      alert('Please select an ad to delete.');
      return;
    }

    try {
      await apiRequest({
        method: 'DELETE',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL_DELETE_AD}${selectedAd.id}`, 
        useCredentials: true,
      });
      setAds(ads.filter(ad => ad.id !== selectedAd.id)); 
      setSelectedAd(null); 
      setSuccess('Ad deleted successfully.');
    } catch (error) {
      setError('Failed to delete ad: ' + error.message);
    } finally {
      setShowConfirmDelete(false); // Close the modal after deletion
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center">Ads History</h1>

      {/* Action Buttons at the Top */}
      <div className="my-4 text-center">
        <ButtonGroup className="mt-2">
          <Button variant="primary" onClick={handleBrowse}>
            <Eye className="me-2" /> Browse
          </Button>
          <Button variant="warning" onClick={handleEdit}>
            <PencilSquare className="me-2" /> Edit
          </Button>
          <Button variant="danger" onClick={() => setShowConfirmDelete(true)}>
            <Trash className="me-2" /> Delete
          </Button>
        </ButtonGroup>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row className="gy-4">
            {ads.map((ad) => (
              <Col key={ad.id} md={6} lg={4}>
                <Card
                  className={`ad-item ${selectedAd?.id === ad.id ? 'border-primary' : ''}`}
                  onClick={() => handleAdSelect(ad)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{ad.title}</Card.Title>
                    <Card.Text>{ad.description}</Card.Text>
                    <Card.Text><strong>Status:</strong> {ad.adStatus}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the ad titled "{selectedAd?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdsHistory;
