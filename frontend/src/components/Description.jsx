import React, { useState} from 'react';
import '../css/Description.css'; 

export default function Descrtiption({ maxChars, varient, placeholder, }){
    const [text, setText] = useState("");
    const [error, setError] = useState("");


const handleChange = (e) => {
    setText(e.target.value.slice(0, maxChars));

    // Descirption Full
    if (!text.trim()){
        setError('No Description. Please enter a desciprtion')
    }
    else{
        setError('')
        }
}

const leftOverChars = maxChars - text.length;

return(
    <div className={varient}>
        <textarea
        id="description"
        value={text}
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