import React, { useState} from 'react';
import DefaultImage from '../assets/DefaultImage.png';
import '../css/ImageUpload.css';

export default function ImageUpload({value, onChange}){
    const [error, setError] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // get the file from the input

        // check if file uploaded 
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result; // encode the image to base64
                onChange(base64Image); // set the base64 image as the value

                setError("");
            };
            reader.onerror = () => {
                setError("Failed to read the file");
            };
            reader.readAsDataURL(file); // read the file as data URL
        } else {
            setError("Please choose a file");
        }
    };

    return (
        <>
            <div className='image-container'>
                {/* preview image */}
                <img src={value || DefaultImage} alt="ExperienceImage" className='upload-photo' />

                <div className='image-upload-container'>
                    <input 
                    type='file'
                    accept='image/*' // restrict to only accept image files
                    id='file'
                    onChange={handleImageUpload} 
                    required
                    />
                </div>
            </div>
        </>
    );
}
