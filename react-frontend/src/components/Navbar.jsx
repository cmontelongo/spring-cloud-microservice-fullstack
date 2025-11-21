import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar() {
    const { user, logout } = useAuth();

    const navStyle = {
        background: "#1a1a1a",
        color: "white",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    };

    const leftStyle = {
        display: "flex",
        alignItems: "center",
        gap: "20px",
    };


    const rightStyle = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    };

    const buttonStyle = {
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
    };


    const loginBtn = {
        ...buttonStyle,
        background: "#0066ff",
        color: "white",
    };

    const registerBtn = {
        ...buttonStyle,
        background: "#00b359",
        color: "white",
    };


    const logoutBtn = {
        ...buttonStyle,
        background: "#cc0000",
        color: "white",
    };

    const linkStyle = {
        color: "white",
        textDecoration: "none",
        fontSize: "18px",
    };


    const titleStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        textDecoration: "none",
        color: "white",
    };

    return (
        <nav style={navStyle}>
            <div style={leftStyle}>
                <Link to="/dashboard" style={titleStyle}>🚀 Dashboard</Link>


                {user && (
                    <>
                        <Link to="/products" style={linkStyle}>Productos</Link>
                        <Link to="/orders" style={linkStyle}>Órdenes</Link>
                    </>
                )}
            </div>

            <div style={rightStyle}>
                {!user ? (
                    <>
                        <Link to="/login" style={loginBtn}>Login</Link>
                        <Link to="/register" style={registerBtn}>Registro</Link>
                    </>
                ) : (
                    <button onClick={logout} style={logoutBtn}>Logout</button>
                )}
            </div>
        </nav>
    );
}