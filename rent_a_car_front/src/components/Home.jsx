

const Home = ({ userData }) => {
    return (
      <div>
        <h1>Dobrodošli, {userData.name}!</h1>
        <p>Ovo je stranica za regular korisnike.</p>
      </div>
    );
  };
  
  export default Home;