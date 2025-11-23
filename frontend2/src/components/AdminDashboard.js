import React from 'react';
import CouponAddForm from './CouponAddForm';

const AdminDashboard = ({ user }) => {
  return (
    <div className="admin-dashboard">
      <h2>Welcome, {user?.name || 'Admin'}</h2>

      {/* Sirf ek line yahan — multi-image add form */}
      <CouponAddForm user={user} />
    </div>
  );
};

export default AdminDashboard;
