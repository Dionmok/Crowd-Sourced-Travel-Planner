import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import SearchBar from '../components/SearchBar';
import TripExperienceTile from '../components/TripExperienceTile';
import SaveTripButton from '../components/SaveTripButton';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FeedPage({ userId }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
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
        let url = 'http://127.0.0.1:5000/experiences';
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

  const handleSaveSuccess = (message) => {
    alert(message);
  };

  const handleSaveError = (error) => {
    alert(`Error saving trip: ${error}`);
  };

  return (
    <div>
      <NavBar />
      <SearchBar onSearch={(query) => navigate(`/feed?keywords=${query.keywords}`)} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="experiences-container">
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <div key={experience.experience_id}>
              <TripExperienceTile experience={experience} showDelete={false}/>
              <SaveTripButton
                tripId={experience.experience_id}
                tripName={experience.trip_name || experience.title}
                tripDescription={experience.trip_description || experience.description}
                startDate={experience.start_date}
                onSuccess={handleSaveSuccess}
                onError={handleSaveError}
              />
            </div>
          ))
        ) : (
          <p>No experiences found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
}