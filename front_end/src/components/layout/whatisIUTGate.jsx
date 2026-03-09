import React from "react";

const features = [
  {
      title: "Solution Administrative",
      description: "Simplifiez votre quotidien étudiant : gestion intuitive des inscriptions, notes et démarches – tout au bout de vos doigts, sans paperasse !",
      icon: "👥"
    },
    {
      title: "Solutions Académiques",
      description: "Transformez vos défis en réussites : accédez instantanément à des problèmes résolus et ressources IUT sur mesure. Votre parcours académique, boosté en un clic !",
      icon: "📚"
    },
    {
      title: "Trouvez Batiment",
      description: "Plongez au cœur de vos campus : plans interactifs, horaires des salles, localisation des labs – trouvez votre espace idéal en un clin d'œil !",
      icon: "🏣"
    },
    {
      title: "Partage de Resource",
      description: "Un hub centralisé pour les notes de cours, annales d'examens et documentation de projets.",
      icon: "📂"
    }
];

function WhatIsIutGate(){

  return (
    <section className="py-20 bg-gray-50 px-6">

        

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          
          {/* Left Column: Text Content */}
          <div className="lg:w-5/12 sticky top-24">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">
              Apropos de la Platform
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Qu'est-ce que l'IUT GATE ?
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
             L'IUT GATE est un écosystème académique dédié, conçu spécifiquement pour les étudiants en IUT.
Nous comblons l'écart entre l'apprentissage en classe et la maîtrise pratique en
fournissant un espace où les étudiants peuvent collaborer, résoudre des problèmes académiques complexes
et suivre leur parcours éducatif en temps réel.
            </p>
            <div className="flex items-center gap-4 text-slate-900 font-semibold">
              <span className="w-12 h-[2px] bg-blue-600"></span>
              Construit par des étudiants, pour des étudiants.
            </div>
          </div>

          {/* Column droit: Feature Grid */}
          <div className="lg:w-7/12 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl border text-slate-100
                   hover:border-blue-500 shadow-sm hover:shadow-md
                    transition-shadow duration-300 "
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-5">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 leading-snug">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIsIutGate;
