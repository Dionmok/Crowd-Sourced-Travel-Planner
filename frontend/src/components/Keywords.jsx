import React, { useState, useEffect} from 'react';
import {FaTrash} from 'react-icons/fa';

export default function Keywords({value=[], onChange}){
    const [keyword, setKeyword] = useState("");

    const [existingKeywords, setExistingKeywords] = useState([]);

    // fetch existing keywords from the backend
    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/get_keywords`);
                if (response.ok) {
                    const data = await response.json();
                    setExistingKeywords(data.map(keyword => keyword.keyword)); // Assume the keyword is in keyword field
                    // setExistingKeywords(data);
                } else {
                    console.error('Failed to fetch keywords');
                }
            }
            catch(error){
                console.error(error);
            }
        }
        fetchKeywords();
    }
    , []);
    console.log("Existing Keywords", existingKeywords);


    // add a keyword to the list
    const handleAdd = () => {
        // check if the keyword is not empty and not already in the list
        if (keyword.trim() && !value.includes(keyword)) {
            onChange([...value, keyword]); // update parent state with new keyword list
            setKeyword(""); 
        }
    };

    const handleDelete = (index) => {
        const updatedKeywords = value.filter((_, i) => i !== index);
        onChange(updatedKeywords); // update parent state after deletion
    }

    return(
        <>
            <div className='keyword-input-container'>  
                <select
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    >
                    <option value="">Select a keyword</option>
                    {existingKeywords.map((existingKeyword, index) => (
                        <option key={index} value={existingKeyword}>
                            {existingKeyword}
                        </option>
                    ))}
                    </select>
                <div className='keyword-input'>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // update keyword input
                        placeholder="Or add new keyword"
                    />
                    <button type='button' onClick={handleAdd}>Add</button>
                </div>
                <div className='keywords-list'>
                    {value.map((keyword, index) => (
                        <div key={index}>
                            {keyword}
                            <button type="button" onClick={() => handleDelete(index)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}