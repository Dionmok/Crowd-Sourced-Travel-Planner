import { useState, useEffect } from 'react';

export default function Rating({userRating, setRating, experience_id}){
    const handleChange = async (e) => {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_API_URL}/rate_experience`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token")
            },
            body: JSON.stringify({
                experience_id: experience_id,
                user_rating: e.target.value
            }),
          });

          setRating(e.target.value)
    }

    return(
        <select 
        name="rating" 
        value={userRating}
        onChange={handleChange}
        required
        >   
            <option value="">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
      </select>
    );
}