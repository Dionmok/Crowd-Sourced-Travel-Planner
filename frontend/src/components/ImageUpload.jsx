import React, { useState} from 'react';
import DefaultImage from '../assets/DefaultImage.png';
import '../css/ImageUpload.css';
export default function ImageUpload(){
    const [imageURL , setImageURL] = useState(DefaultImage);

    return (
        <>
            <div className='image-container'>
                <img src={imageURL} alt="ExperienceImage" />
            </div>
        </>
    );
}
