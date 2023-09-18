import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";

const ProtectedRoute = ({ children }: {children: React.ReactNode}) => {
    const {user, isLoading} = useAuth()
    
    if(isLoading) return <></>

    if (!user) {
      return <Navigate to="/" replace />;
    }
  
    return children;
};

export default ProtectedRoute