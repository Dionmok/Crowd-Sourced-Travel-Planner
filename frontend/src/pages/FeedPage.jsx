import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import TripExperienceTile from '../components/TripExperienceTile';
import '../css/FeedPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FeedPage({ userId }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const keywords = params.get('keywords');
    return { location: locationParam, keywords };
  };

  useEffect(() => {
    const { location: locationParam, keywords } = getQueryParams();

    setLoading(true);
    setError(null);

    const fetchExperiences = async () => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/experiences`;
        const queryParams = new URLSearchParams();
        if (locationParam) queryParams.append('location', locationParam);
        if (keywords) queryParams.append('keywords', keywords);
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch experiences');
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        setError(error.message);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [location.search]);

  return (
    <>
      <NavBar current="feed"/>
      <SearchBar onSearch={(query) => navigate(`/feed?keywords=${query.keywords}`)} />
      <div className='feed-container'>
      <main className="feed-experiences-container">
        {loading ? (
          <p>Loading experiences...</p>
        ) : error ? (
          <p>{error}</p>
        ) : experiences.length === 0 ? (
          <p>No experiences found matching your search criteria.</p>
        ) : (
          experiences.map((experience) => (
            <div key={experience.experience_id}>
              <TripExperienceTile experience={experience} showDelete={false}/>
            </div>
          ))
        )}
      </main>
      </div>
    </>
  );
}