import { Link } from "react-router-dom";

import WhatIsIutGate from '../../components/layout/whatisIUTGate'
import CoreSecton from "../../components/layout/coreService";

function Home() {




  return (
<>
    <div className="relative w-full font-sans">
      {/* Background Image Header */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat min-h-[500px] flex items-center"
        style={{ 
          backgroundImage: `url('public/iut-campus1.jpg')` 
        }}
      >
        {/* Dark Overlay Filter */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

        {/* Content Aligned Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Bienvenue sur <span className="text-blue-400">IUT GATE</span> 
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Une plateforme pour explorer le campus de l'IUT, trouver les salles de cours et accéder facilement aux informations académiques.
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Section  */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* CTA 1 */}
          <div className="bg-white flex justify-center align-baseline flex-col hover:bg-gray-150 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border-b-4 border-blue-500">
            <Link to="/campus-map" className="text-gray-900 font-bold group-hover:text-blue-600 block ">Trouver ma classe</Link>
            <span className="text-gray-600 font-semibold items-center">Lire Plus →</span>
          </div>

          {/* CTA 2 */}
          <div className="bg-white hover:bg-gray-50 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border-b-4 border-indigo-500">
           <Link to="/courses" className="text-gray-900 font-bold group-hover:text-blue-600 block ">Cours et programmes</Link>
            <span className="text-gray-600 font-semibold items-center">Lire Plus →</span>
          </div>

          {/* CTA 3 */}
          <div className="bg-white hover:bg-gray-50 p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border-b-4 border-purple-500">
           <Link to="/admin-offices" className="text-gray-900 font-bold group-hover:text-blue-600 block ">Administration</Link>
            <span className="text-gray-600 font-semibold items-center">Lire Plus →</span>
          </div>

        </div>
      </div>
    </div>

    <WhatIsIutGate />

    <CoreSecton />




    </>


  
  );
}

export default Home;
