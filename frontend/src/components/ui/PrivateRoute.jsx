import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  const { data: user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  // Verify if either token exists or user object exists in Redux state
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
