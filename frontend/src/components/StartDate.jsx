import { useState } from 'react';
import '../css/StartDate.css'; 

export default function StartDate () {
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    // Date validation function
    function validateDate(inputdate){
        var [month,day,year] = date.split('/');
        month = parseInt(month,10)
        day = parseInt(day,10)
        year = parseInt(year,10)

        const monthRegex = /^(0[1-9]|1[0-2])$/
        const dayRegex = /^(|0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
        const yearRegex = /^([1-9][0-9][0-9][0-9])$/

        if (date.length != 10) return fasle;
        if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
        if (!monthRegex.test(month)) return false;
        if (!dayRegex.test(day)) return false;
        if (!yearRegex.test(year)) return false;
        return true;
    }
    
    const handleChange = (e) => {
        // Limits character count
        setDate(e.target.value.slice(0, 10))
        
        // Date validation
        if (date && !validateDate(date)){
            setError('Invalid date. Please enter a valid date')
        }
        else{
            setError('')
        }
    }

    const handleSubmit = (e) => {
        pass
    }
    
    return(
        <div>
        <label> 
            <input
                type="text"
                value={date}
                onChange={handleChange}
                placeholder="MM/DD/YYYY"
                style ={{
                    color: error ? 'red' : 'black',
                }}
                />
        </label>
        </div>
    );
}