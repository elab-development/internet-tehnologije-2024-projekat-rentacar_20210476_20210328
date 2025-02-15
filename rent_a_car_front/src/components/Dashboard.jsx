import React from "react";

const Dashboard = ({ userData }) => {
    return (
      <div>
        <h1>Dobrodošli, {userData.name}!</h1>
        <p>Ovo je stranica za administratore.</p>
      </div>
    );
  };
  
  export default Dashboard;