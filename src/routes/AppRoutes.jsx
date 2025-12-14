import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import AddRoom from "../pages/AddRoom";
import MyRooms from "../pages/MyRooms";
import EditRoom from "../pages/EditRoom";
import RoomsList from "../pages/RoomsList";
import RoomDetails from "../pages/RoomDetails";
import BookingRequests from "../pages/BookingRequests";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      <Route path="/add-room" element={<ProtectedRoute><AddRoom /></ProtectedRoute>}/>
      <Route path="/my-rooms" element={<ProtectedRoute><MyRooms /></ProtectedRoute>}/>
      <Route path="/edit-room/:id" element={<ProtectedRoute><EditRoom /></ProtectedRoute>}/>
      <Route path="/rooms" element={<RoomsList />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="/booking-requests" element={<ProtectedRoute><BookingRequests/>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
};

export default AppRoutes;
