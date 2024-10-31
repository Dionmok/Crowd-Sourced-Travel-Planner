import React, { useState} from 'react';
import '../css/GeolocationInput.css';

export default function GeolocationInput({placeholder, id, value="", onChange}){
    // TODO: implement Error Handling for invalid input
    const [error, setError] = useState("");
    const maxChars = 8;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    // handle input change
    const handleChange = (e) => {
        const value = e.target.value.slice(0, maxChars);
        onChange(value); //call onChange from props to update parent state
    };

const leftOverChars = maxChars - value.length;

return(
    <div>
        {/* input field*/}
        <input
        id={id}
        type="number"
        value={value} // use value from props
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxChars}
        required
        />
        {/* display error message if input is invalid */}
        <div className="charCounter">
            {leftOverChars} characters remaining
        </div>
    </div>
)
};


