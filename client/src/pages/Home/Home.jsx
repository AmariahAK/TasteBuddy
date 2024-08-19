import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="bg-cover bg-center font-urbanist h-screen relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522546889731-cbdb0fae9557?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">IGNITE CULINARY MAGIC</h1>
          <p className="text-lg mb-6">Discover a world of flavours, create your own recipes, and let your home smell like our love of cooking</p>
          <div className="space-x-4">
            <Link to='/login' className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded">Log In</Link>
            <Link to='/signup' className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded">Sign Up</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
