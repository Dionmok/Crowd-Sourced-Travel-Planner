import React from 'react';
import '../css/GeolocationInput.css';

export default function GeolocationInput({ placeholder, id, value = "" }) {
  return (
    <div>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        disabled
        className="geo-input"
        required
      />
    </div>
  );
}
