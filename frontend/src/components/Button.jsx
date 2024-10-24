import { useNavigate } from 'react-router-dom';

// pass in buttonName and routeTo as props
export default function Button({buttonName, routeTo}) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(routeTo);
    };

    return (
        <button onClick={handleClick}> 
            {buttonName}
        </button>
    );
};
