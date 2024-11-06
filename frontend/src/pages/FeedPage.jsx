import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import TripExperienceTile from '../components/TripExperienceTile';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FeedPage({ userId }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const keywords = params.get('keywords');
    return { keywords };
  };

  useEffect(() => {
    const { keywords } = getQueryParams();

    setLoading(true);
    setError(null);

    const fetchExperiences = async () => {
      try {
        let url = 'http://127.0.0.1:5000/experiences';
        if (keywords) {
          url += `?keywords=${keywords}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch experiences');
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [location.search]);

  return (
    <div>
      <NavBar />
      <SearchBar onSearch={(query) => navigate(`/feed?keywords=${query.keywords}`)} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="experiences-container">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <TripExperienceTile
              key={experience.experience_id}
              experience={experience}
            />
          ))
        ) : (
          <p>No experiences found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
}
