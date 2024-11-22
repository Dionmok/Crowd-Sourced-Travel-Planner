import { useNavigate, useLocation } from 'react-router-dom';
import '../css/ButtonLink.css'; 

// pass in buttonName and routeTo as props
export default function Button({varient, buttonName, routeTo=null}) {
    const navigate = useNavigate()
    const location = useLocation();
    const from = location.state?.from;
    const trip = location.state?.trip;

    const handleClick = (e) => {
        e.preventDefault();
        buttonName === "Back" && routeTo !== "/myTrips" ? navigate(from, { state: { trip } }) : navigate(routeTo);
    };

    return (
        <button className={varient} onClick={handleClick}> 
            {buttonName}
        </button>
    );
};