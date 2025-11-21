import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


export function LogoutButton() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();


    const handle = () => {
        logout();
        navigate('/login');
    };


    return (
        <button onClick={handle} className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700">
            Logout
        </button>
    );
}