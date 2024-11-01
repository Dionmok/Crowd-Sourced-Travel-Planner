import { useNavigate } from 'react-router-dom';
import '../css/ButtonLink.css'; 

// pass in buttonName and routeTo as props
export default function Button({varient,buttonName, routeTo}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(routeTo);
    };

    return (
        <button className={varient} onClick={handleClick}> 
            {buttonName}
        </button>
    );
};
