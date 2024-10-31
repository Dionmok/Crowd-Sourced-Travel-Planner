import React, { useState } from 'react';

export default function Rating({value, id, onChange}){
    
    const handleChange = (e) => {
        onChange(e.target.value);
    }

    return(
        <select 
        name="rating" 
        id={id}
        value={value}
        onChange={handleChange}
        required
        >   
            <option value="">Select Rating</option> {/* Default option */}
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
      </select>
    );
}