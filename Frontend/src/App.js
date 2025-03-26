import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Footer from './Components/footer';
import Header from './Components/guest_header';
import MainDashboard from './Pages/Admin/main_dashboard';
import MemberRegistration from './Pages/Member/Register';
import MemberLogin from './Pages/Member/Login';
import ManageProfile from './Pages/Member/ManageProfile';

import AddHomeInventory from './Pages/HomeInventory/AddHomeInventory';
import UpdateHomeInventory from './Pages/HomeInventory/UpdateHomeInventory';
import ViewHomeInventory from './Pages/HomeInventory/ViewHomeInventory';
import HomeInventoryReport from './Pages/HomeInventory/InventoryReport';

import AddGroceryItem from './Pages/Grocery/AddGrocery';
import ViewGroceryItems from './Pages/Grocery/ViewGrocery';
import UpdateGroceryItem from './Pages/Grocery/UpdateGrocery';
import GroceryReport from './Pages/Grocery/GroceryReport';
import Home from './Pages/Home/Home';

function App() {
  return (
      <div>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home/>} />

          <Route path="/login" element={<MemberLogin/>} />
          <Route path="/register" element={<MemberRegistration/>} />
          <Route path="/manage-profile" element={<ManageProfile/>} />
          <Route path="/dashboard" element={<MainDashboard/>} />

          <Route path="/add-home-inventory" element={<AddHomeInventory/>} />
          <Route path="/update-home-inventory/:id" element={<UpdateHomeInventory/>} />
          <Route path="/view-home-inventory" element={<ViewHomeInventory/>} />
          <Route path="/home-inventory-report" element={<HomeInventoryReport/>} />

          <Route path="/add-grocery-item" element={<AddGroceryItem/>} />
          <Route path="/update-grocery-item/:id" element={<UpdateGroceryItem/>} />
          <Route path="/view-grocery-items" element={<ViewGroceryItems/>} />
          <Route path="/grocery-items-report" element={<GroceryReport/>} />
        </Routes>
        <Footer></Footer>
      </div>
  );
}

export default App;
