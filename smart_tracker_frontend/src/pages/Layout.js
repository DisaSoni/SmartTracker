import { useContext, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

const Layout = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const { logout } = useContext(UserContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user])

    return (
        <div className="layout-body">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src="./smart-tracker.png" className="logo" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/">Home</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/board">Board</Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">PROFILE</Link>
                            </li>
                            <li className="nav-item">
                                {user ?
                                    <span className="nav-link" onClick={handleLogout}>Logout</span>
                                    :
                                    <Link className="nav-link" to='/login'>Login</Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer text-center p-5">
                <p>2023 Copyright reserved &copy; Disa Soni</p>
            </footer>
        </div>
    )
};

export default Layout;