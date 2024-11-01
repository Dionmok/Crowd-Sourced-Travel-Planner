import React, { useState} from 'react';
import DefaultImage from '../assets/DefaultImage.png';
import '../css/ImageUpload.css';

export default function ImageUpload({value, onChange}){
    const [error, setError] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // get the file from the input

        // check if file uploaded 
        if (file) {
            const imagePreview = URL.createObjectURL(file); // create a preview of the image
            onChange(imagePreview); // set the preview as the image
            setError("");
        } else {
            setError("Please choose a file");
        }
    };

    return (
        <>
            <div className='image-container'>
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
