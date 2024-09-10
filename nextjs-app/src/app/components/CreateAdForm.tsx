'use client'

import React, { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/axiosApiRequest';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify'; 
import { Button } from 'react-bootstrap';

interface CreateAdFormProps {
  adId?: string;
  initialData?: Partial<FormData>;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  minimumPrice: number;
  type: string;
  acceptMessages: boolean;
  location: string;
  categoryId: string;
  subcategoryId: string;
  adStatus: 'ACTIVE',
}

const CreateAdForm = ({ adId, initialData }: CreateAdFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    minimumPrice: 0,
    type: 'SELL',
    acceptMessages: true,
    location: '',
    categoryId: '',
    subcategoryId: '',
    adStatus: 'ACTIVE',
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ b64: string }[]>([]);
  const [initialExistingImages, setInitialExistingImages] = useState<{ b64: string }[]>([]); // Store initial state

  useEffect(() => {
    if (initialData) {
        console.log("received Data: ",initialData)
      // Extract and set only the necessary fields from initialData
      const { title, description, price, minimumPrice, acceptMessages, location, categoryId, subcategoryId, mediaData } = initialData;
      setFormData({
        title: title || '',
        description: description || '',
        price: price || 0,
        minimumPrice: minimumPrice || 0,
        type: 'SELL',
        acceptMessages: acceptMessages !== undefined ? acceptMessages : true,
        location: location || '',
        categoryId: categoryId || '',
        subcategoryId: subcategoryId || '',
        adStatus: 'ACTIVE',
      });

      setExistingImages(mediaData || []);
      console.log("init, mediaData: ",mediaData)
      setInitialExistingImages(mediaData || []); 

    }
  }, [initialData]);

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

  const removeNewImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
    
  };

  const uploadImages = async (adId: string) => {
    const uploadedMediaIds: string[] = [];

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('adId', adId);
      formData.append('type', 'IMAGE');

      try {
        const response = await apiRequest({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_UPLOAD_MEDIA}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          useCredentials: true,
        });
        console.log('Image uploaded successfully:', response.data);
        uploadedMediaIds.push(response.data.id);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    return uploadedMediaIds;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (adId) {
        // Update existing ad
        await apiRequest({
          method: 'PUT',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_UPDATE_AD}/${adId}`,
          data: {
            ...formData,
            price: Number(formData.price),
            minimumPrice: Number(formData.minimumPrice),
            type: 'SELLING'
          },
          useCredentials: true,
        });
        console.log('Ad updated successfully');
        resetForm();
        toast.success('Ad updated successfully'); 

      
         // Compare initialExistingImages with current existingImages to determine if images have changed
      const imagesHaveChanged =
        initialExistingImages.length !== existingImages.length ||
        initialExistingImages.some((img, index) => img.b64 !== existingImages[index]?.b64);

        
      if (imagesHaveChanged) {
        console.log('Images have changed');

        // Delete removed images
        const removedImages = initialExistingImages.filter(
          (img) => !existingImages.some((currentImg) => currentImg.b64 === img.b64)
        );
        var res = null;
        for (const image of removedImages) {
            console.log("in removedImages looping for delete req, image.id: ",image.id)
          try {
            res =  await apiRequest({
              method: 'DELETE',
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL_DELETE_MEDIA}`,
              data: { id: image.id }, // Using media ID for deletion
              useCredentials: true,
            });
            console.log('Image deleted successfully:', image.id);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
          console.log("res: ",res)
        }


      }

        // Identify new images
        console.log("checking if new images exists...")
        const newImages = selectedImages.filter(
            (newImage) => !existingImages.some((existingImage) => URL.createObjectURL(newImage) === `data:image/jpeg;base64,${existingImage.b64}`)
                  );
        
        console.log("selected Images: ",selectedImages)

        // Upload only new images
        if (selectedImages.length > 0) {
          console.log('Uploading new images...');
          const mediaIds = await uploadImages(adId);
          console.log('New images uploaded successfully:', mediaIds);
        // update media
        }
      } else {
        console.log("creating new ad..")
        console.log("formData:",formData)
        // Create new ad
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

        const adId = createAdResponse.data.adId;

        // Upload Media with the created Ad ID
        const mediaIds = await uploadImages(adId);

        console.log('Ad created and media uploaded successfully:', mediaIds);
        resetForm();
        toast.success('Ad created and media uploaded successfully'); 

      }
    } catch (error) {
      console.error('Error creating or updating ad:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      minimumPrice: 0,
      type: 'SELL',
      acceptMessages: true,
      location: '',
      categoryId: '',
      subcategoryId: '',
      adStatus: 'ACTIVE',
    });
    setCategories([]);
    setSubcategories([]);
    setSelectedImages([]);
    setExistingImages([]);
    setInitialExistingImages([]);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`container mt-4`}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
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
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
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
        <label htmlFor="minimumPrice" className="form-label">Minimum Price</label>
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
        <label htmlFor="category" className="form-label">Category</label>
        <select
          id="category"
          name="categoryId"
          className="form-select"
          value={formData.categoryId}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="subcategory" className="form-label">Subcategory</label>
        <select
          id="subcategory"
          name="subcategoryId"
          className="form-select"
          value={formData.subcategoryId}
          onChange={handleChange}
        >
          <option value="">Select a subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="acceptMessages" className="form-check-label">Accept Messages</label>
        <input
          type="checkbox"
          id="acceptMessages"
          name="acceptMessages"
          className="form-check-input"
          checked={formData.acceptMessages}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="location" className="form-label">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          className="form-control"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="images" className="form-label">Upload Images (up to 10)</label>
        <input
          type="file"
          id="images"
          className="form-control"
          multiple
          onChange={handleImageChange}
        />
        <div className="mt-3">
          {selectedImages.map((image, index) => (
            <div key={index} className="d-inline-block me-2">
              <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} width="100" height="100" className="d-block mb-2" />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeNewImage(index)}>Remove</button>
            </div>
          ))}
          {existingImages.map((media, index) => (
            <div key={index} className="d-inline-block me-2">
              <img src={`data:image/jpeg;base64,${media.b64}`} alt={`Base64 Image ${index}`} width="100" height="100" className="d-block mb-2" />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExistingImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
        <div className='text-center p-10'>
        <Button type="submit" className="btn btn-primary">Submit</Button>
          {/* Reset Button */}
          <Button type="button" onClick={resetForm} className="ml-14 btn btn-secondary">
            Reset
          </Button>
        </div>
    </form>
  );
};

export default CreateAdForm;
