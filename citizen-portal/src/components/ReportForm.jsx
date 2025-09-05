import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../../../shared/supabase.js';
import { uploadImage } from '../../../shared/supabase.js';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReportForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('pothole');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [reportId, setReportId] = useState(null);

  const categories = [
    { id: 'pothole', label: 'Pothole', icon: '🕳️' },
    { id: 'streetlight', label: 'Street Light', icon: '💡' },
    { id: 'garbage', label: 'Garbage', icon: '🗑️' },
    { id: 'vandalism', label: 'Vandalism', icon: '🎨' },
    { id: 'other', label: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          setError('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      
      // Upload photo if provided
      if (photo) {
        imageUrl = await uploadImage(photo);
      }

      // Get address if not provided
      let finalAddress = address;
      if (!finalAddress && location) {
        // In a real app, you would use a reverse geocoding service here
        finalAddress = `Lat: ${location.lat}, Lng: ${location.lng}`;
      }

      // Save report to database
      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            title,
            description,
            category,
            location: location ? `SRID=4326;POINT(${location.lng} ${location.lat})` : null,
            latitude: location ? location.lat : null,
            longitude: location ? location.lng : null,
            address: finalAddress,
            image_url: imageUrl
          }
        ])
        .select();

      if (error) throw error;
      
      setSuccess(true);
      setReportId(data[0].id);
      
      // Clear form
      setTitle('');
      setDescription('');
      setCategory('pothole');
      setPhoto(null);
      setAddress('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (e) => {
    const { lat, lng } = e.latlng;
    setLocation({ lat, lng });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Report an Issue</h2>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Your report has been submitted successfully. Report ID: {reportId}</span>
        </div>
      ) : null}

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 block w-full border border-gray-30 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={4}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter address or it will be detected from your location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {location && (
          <div className="h-64 rounded-lg overflow-hidden">
            <MapContainer
              center={[location.lat, location.lng]}
              zoom={15}
              style={{ height: '256px', width: '100%' }}
              onclick={handleLocationSelect}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[location.lat, location.lng]}>
                <Popup>
                  Selected location
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="loader-icon animate-spin -ml-1 mr-3 text-white" />
                Submitting...
              </>
            ) : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;