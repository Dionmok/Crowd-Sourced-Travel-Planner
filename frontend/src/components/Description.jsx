import { useState, useEffect} from 'react';
import '../css/Description.css'; 

export default function Description({ maxChars, variant, placeholder, value, setText }) {
    const [text, setTextState] = useState(value || "");
    const [error, setError] = useState("");

    useEffect (() => {
        setTextState(value);
    }, [value]);

    const handleChange = (e) => {
        const newText = e.target.value.slice(0, maxChars);
        setTextState(newText);
        setText(newText);

    if (!newText.trim()){
        setError('No Description. Please enter a desciprtion');
    }
    else{
        setError('');
        }
};

const leftOverChars = maxChars - text.length;

return(
    <div className={variant}>
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