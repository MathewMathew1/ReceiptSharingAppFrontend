import { Route, Routes } from 'react-router-dom';
import './App.css'
import { Navbar } from './Components/Navbar'
import { ThemeProvider } from './Contexts/useTheme'
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import { AuthProvider } from './Contexts/useAuth';
import CreateReceipt from './Components/Receipts/CreateReceipt';
import ProtectedRoute from './Components/ProtectedRoute';
import ReceiptComponent from './Components/Receipts/ReceiptComponent';
import ToastProvider from './Contexts/useToast';
import ToastContainer from './Components/ToastContainer';
import  UserProfile  from './Components/User/UserProfile';
import UserReceipts from './Components/User/UserReceipts';
import YourSubscribeReceipts from './Components/User/YourSubscribedReceipts';
import YourReceipts from './Components/User/YourReceipts';
import CurrentUserProfile from './Components/User/CurrentUserProfile';

function App() {
  return (
    <div className='bg-light-primaryBg min-h-screen flex flex-col dark:bg-dark-primaryBg text-light-text dark:text-dark-text h-[100%]'>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<SignIn/>} />
                <Route path="/profile/:id" element={<UserProfile/>} />
                <Route path="/user/receipts/:id" element={<UserReceipts/>} />
                <Route path="/receipt/:id" element={<ReceiptComponent/>} />
                <Route path="/subscribed/receipts" element={
                  <ProtectedRoute>
                    <YourSubscribeReceipts/>
                  </ProtectedRoute>
                } />
                <Route path="user/profile" element={
                  <ProtectedRoute>
                    <CurrentUserProfile/>
                  </ProtectedRoute>
                }/>
                <Route path="/user/receipts" element={
                  <ProtectedRoute>
                    <YourReceipts/>
                  </ProtectedRoute>
                } />
                <Route path="/new/receipt" element={
                  <ProtectedRoute>
                    <CreateReceipt isUpdate={false}/>
                  </ProtectedRoute>
                } />
                {/* Add more routes as needed */}
              </Routes>
              <ToastContainer/>
            </ThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </div>
  )
}

export default App
