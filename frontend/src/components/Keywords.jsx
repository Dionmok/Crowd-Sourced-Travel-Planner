import React, { useState} from 'react';

export default function Keywords({value=[], onChange}){
    const [keyword, setKeyword] = useState("");

    // add a keyword to the list
    const handleAdd = () => {
        // check if the keyword is not empty
        if (keyword.trim()) {
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
                <div className='keyword-input'>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // update keyword input
                        placeholder="Add keyword"
                    />
                    <button type='button' onClick={handleAdd}>Add</button>
                </div>
                <div className='keywords-list'>
                    {value.map((keyword, index) => (
                        <div key={index}>
                            {keyword}
                            <button type="button" onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}