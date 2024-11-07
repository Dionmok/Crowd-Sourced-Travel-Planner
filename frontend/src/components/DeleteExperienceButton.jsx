import {useState} from "react";

export default function DeleteExperienceButton({experienceId, userId, onExperienceDeleted}) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this experience?");
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/delete_experience`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({experience_id: experienceId, user_id: userId}),
        });

        if (!response.ok) {
            throw new Error('Failed to delete the experience');
        }
        setSuccess(true);
        onExperienceDeleted(experienceId);
    } catch (err) {
        setError(err.message);
    }
};
    return (
        <div>
            <button onClick={handleDelete}>
                Delete
            </button>
        </div>
    );
};