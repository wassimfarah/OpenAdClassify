'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/axiosApiRequest';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import styles from './CreateAdForm.module.css'

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
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : (name === 'price' || name === 'minimumPrice' ? Number(value) : value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest({
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
      console.log('Ad created successfully:', response);
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={`container mt-4 ${styles.container}`}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" id="title" name="title" className="form-control" placeholder="Title" value={formData.title} onChange={handleChange} required />
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea id="description" name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input type="number" id="price" name="price" className="form-control" placeholder="Price" value={formData.price} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="minimumPrice" className="form-label">Minimum Price</label>
        <input type="number" id="minimumPrice" name="minimumPrice" className="form-control" placeholder="Minimum Price" value={formData.minimumPrice} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="type" className="form-label">Type</label>
        <select id="type" name="type" className="form-select" value={formData.type} onChange={handleChange}>
          <option value="SELLING">SELLING</option>
          <option value="BUYING">BUYING</option>
          <option value="RENTING">RENTING</option>
        </select>
      </div>

      <div className="form-check mb-2">
        <input type="checkbox" id="acceptOffer" name="acceptOffer" className="form-check-input" checked={formData.acceptOffer} onChange={handleChange} />
        <label htmlFor="acceptOffer" className="form-check-label">Accept Offer</label>
      </div>

      <div className="form-check mb-2">
        <input type="checkbox" id="acceptMessages" name="acceptMessages" className="form-check-input" checked={formData.acceptMessages} onChange={handleChange} />
        <label htmlFor="acceptMessages" className="form-check-label">Accept Messages</label>
      </div>

      <div className="form-check mb-2">
        <input type="checkbox" id="acceptExchange" name="acceptExchange" className="form-check-input" checked={formData.acceptExchange} onChange={handleChange} />
        <label htmlFor="acceptExchange" className="form-check-label">Accept Exchange</label>
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location</label>
        <input type="text" id="location" name="location" className="form-control" placeholder="Location" value={formData.location} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="adStatus" className="form-label">Ad Status</label>
        <select id="adStatus" name="adStatus" className="form-select" value={formData.adStatus} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="categoryId" className="form-label">Category</label>
        <select id="categoryId" name="categoryId" className="form-select" value={formData.categoryId} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="subcategoryId" className="form-label">Subcategory</label>
        <select id="subcategoryId" name="subcategoryId" className="form-select" value={formData.subcategoryId} onChange={handleChange} required>
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory: any) => (
            <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Create Ad</button>
    </form>
  );
};

export default CreateAdForm;
