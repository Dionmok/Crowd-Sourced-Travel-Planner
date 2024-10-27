import React, { useState } from 'react';
import '../css/StartDate.css'; 

export default function StartDate () {
    const [date, setDate] = useState("");

    const handleChange = (e) => {
        setDate(e.target.value)
    }

    return(
        <div>
        <label> 
            Enter Start Date (MM/DD/YYYY)
            <input
                type="text"
                value={date}
                onChange={handleChange}
                placeholder="MM/DD/YYYY"
                />
        </label>
        </div>
    );
}