import { Link } from "react-router-dom";

function Home() {

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  
};


  return (
    <div className=" ">
      <img src="public/iut-campus1.jpg" alt="campus 1" className="relative brightness-50" />
      
      <div className="flex flex-col pl-30 absolute top-0 left-0 mt-50 text-start max-w-4xl">
         <h1 className="text-blue-400 text-xl font-bold ml-40 text-start ">Bienvenue sur IUT GATE</h1>
      <p className="font-bold text-3xl  text-blue-50 ml-30 ">
       Une plateforme pour explorer le campus de l'IUT, trouver les salles de cours et accéder facilement aux informations académiques.
      </p>
      </div>
     

      <div style={{style}}  className="buttons grid grid-cols-3 divide-x-4  divide-indigo-500/50 top-0 mt-115 rounded-2xl ml-25 shadow-2xl bg-blue-50 mx-auto h-30 w-200 absolute">
        <Link to="/campus-map" className="pt-12  transition duration-150 hover:bg-blue-300/10 font-bold text-2xl ">Trouver ma classe</Link>
        <Link to="/courses" className="pt-12  transition duration-150 hover:bg-blue-300/10 font-bold text-2xl">Cours et programmes</Link>
        <Link to="/admin-offices" className="pt-12 transition duration-150 hover:bg-blue-300/10 font-bold text-2xl">Administration</Link>
      </div>
    </div>
  );
}

export default Home;
