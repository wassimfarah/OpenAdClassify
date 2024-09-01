'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/axiosApiRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './CreateAdForm.module.css';

const CreateAdForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    minimumPrice: 0,
    type: 'SELL',
    acceptOffer: false,
    acceptMessages: false,
    acceptExchange: false,
    location: '',
    adStatus: 'ACTIVE',
    categoryId: '',
    subcategoryId: '',
    mediaIds: [] as string[],
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_Get_CATEGORIES}`,
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.categoryId) {
        try {
          const response = await apiRequest({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL_Get__SUBCATEGORIES_BY_CAT_ID}/${formData.categoryId}`,
          });
          setSubcategories(response.data);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      }
    };
    loadSubcategories();
  }, [formData.categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'price' || name === 'minimumPrice'
          ? Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 10) {
        alert("You can only upload up to 10 images.");
        return;
      }
      setSelectedImages(prevImages => [...prevImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async (adId: string) => {
    const uploadedMediaIds: string[] = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('adId', adId);
      formData.append('type', 'IMAGE')

      try {
        const response = await apiRequest({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_UPLOAD_MEDIA}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          useCredentials: true,
        });
        console.log('Image uploaded successfully:', response.data);
        uploadedMediaIds.push(response.data.id);  // Collect uploaded media IDs
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedMediaIds;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createAdResponse = await apiRequest({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL_CREATE_AD}`,
        data: {
          ...formData,
          price: Number(formData.price),
          minimumPrice: Number(formData.minimumPrice),
          type: 'SELLING',
        },
        useCredentials: true,
      });
      console.log('Ad created successfully:', createAdResponse);

      const adId = createAdResponse.data.adId; // Extract created ad ID from the response

      // Upload Media with the created Ad ID
      const mediaIds = await uploadImages(adId);  // Pass the adId to the uploadImages function

      console.log('Ad created and media uploaded successfully:', mediaIds);
    } catch (error) {
      console.error('Error creating ad or uploading media:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={`container mt-4 ${styles.container}`}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="minimumPrice" className="form-label">
          Minimum Price
        </label>
        <input
          type="number"
          id="minimumPrice"
          name="minimumPrice"
          className="form-control"
          value={formData.minimumPrice}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          name="categoryId"
          className="form-select"
          value={formData.categoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="subcategory" className="form-label">
          Subcategory
        </label>
        <select
          id="subcategory"
          name="subcategoryId"
          className="form-select"
          value={formData.subcategoryId}
          onChange={handleChange}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcat) => (
            <option key={subcat.id} value={subcat.id}>
              {subcat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="images" className="form-label">
          Upload Images (max 10)
        </label>
        <input
          type="file"
          id="images"
          name="images"
          className="form-control"
          multiple
          onChange={handleImageChange}
        />
        <div className="mt-3">
          {selectedImages.map((image, index) => (
            <div key={index} className="d-inline-block position-relative me-2">
              <img
                src={URL.createObjectURL(image)}
                alt={`Selected Image ${index + 1}`}
                className="img-thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0"
                style={{ borderRadius: '50%', width: '20px', height: '20px' }}
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="acceptOffer"
          name="acceptOffer"
          className="form-check-input"
          checked={formData.acceptOffer}
          onChange={handleChange}
        />
        <label htmlFor="acceptOffer" className="form-check-label">
          Accept Offers
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="acceptMessages"
          name="acceptMessages"
          className="form-check-input"
          checked={formData.acceptMessages}
          onChange={handleChange}
        />
        <label htmlFor="acceptMessages" className="form-check-label">
          Accept Messages
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="acceptExchange"
          name="acceptExchange"
          className="form-check-input"
          checked={formData.acceptExchange}
          onChange={handleChange}
        />
        <label htmlFor="acceptExchange" className="form-check-label">
          Accept Exchange
        </label>
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          className="form-control"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Create Ad
      </button>
    </form>
  );
};

export default CreateAdForm;
