import React, { useState} from 'react';
import '../css/Description.css'; 

export default function TextBox({ maxChars, varient, placeholder, onChange , value="", id}){
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value.slice(0, maxChars)
        onChange(value); // call onChange from props to update parent state

        // Descirption Full
        if (!value.trim()){
            setError('No Description. Please enter a desciprtion')
        }
        else{
            setError('')
            }
    }

    const leftOverChars = maxChars - value.length;

    return(
        <div className={varient}>
            <textarea
            id={id}
            value={value}
            onChange={handleChange}
            rows="4"
            placeholder={placeholder}
            maxLength={maxChars}
            />
        <div className="charCounter">
            {leftOverChars} characters remaining
        </div>
        </div>
    );
}