import React, { useState } from 'react';
import '../css/SearchBar.css';

export default function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');
    const [keywords, setKeywords] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch({ location, keywords });
        }
        setLocation(''); 
        setKeywords(''); 
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <button type="submit" className="search-button">SEARCH</button>
            <div className="input-fields">
                <div className="field-container">
                    <label className="input-label">LOCATION</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="location-input"
                        placeholder="e.g. Los Angeles, California, United States"
                    />
                </div>
                <div className="field-container">
                    <label className="input-label">KEYWORDS</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="keywords-input"
                        placeholder="e.g. hike, restaurant, club"
                    />
                </div>
            </div>
        </form>
    );
}
