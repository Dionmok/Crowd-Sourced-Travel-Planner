import React, { useState} from 'react';
import '../css/Keywords.css';

export default function Keywords(){
    const [keywords, setKeywords] = useState([]);
    const [keyword, setKeyword] = useState("");

    // add a keyword to the list
    const handleAdd = () => {
        // check if the keyword is not empty
        if (keyword.trim()) {
            setKeywords([...keywords, keyword]);
            setKeyword(""); // clear input after adding keyword
        }
    };

    // delete a keyword from the list
    const handleDelete = (index) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    }

    return(
        <>
            <div class='keyword-input-container'>  
                <div class='keyword-input'>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Add keyword"
                    />
                    <button onClick={handleAdd}>Add</button>
                </div>
                <div class='keywords-list'>
                    {keywords.map((keyword, index) => (
                        <div key={index}>
                            {keyword}
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}