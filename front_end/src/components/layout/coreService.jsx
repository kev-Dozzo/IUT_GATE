import React from 'react';


  const coreFeatures = [
    {
      title: "Orientation académique",
      description: "Naviguez dans votre parcours de formation avec une orientation experte et une planification académique adaptée à chaque département.",
      icon: "🎓"
    },
    {
      title: "Informations sur les cours",
      description: "Explorez en détail les programmes, les exigences de crédits et les choix d’options pour votre semestre.",
      icon: "📖"
    },
    {
      title: "Préparation aux examens",
      description: "Accédez à des supports de révision sélectionnés, des banques d’anciens sujets et des conseils stratégiques pour réussir vos examens.",
      icon: "✍️"
    },
    {
      title: "Règles et procédures",
      description: "Restez informé des politiques de l’université, des dates limites d’inscription et des procédures administratives.",
      icon: "⚖️"
    },
    {
      title: "Orientation professionnelle",
      description: "Découvrez des opportunités de stage et des perspectives de carrière en lien avec votre domaine d’étude.",
      icon: "💼"
    },
    {
      title: "Soutien entre pairs",
      description: "Connectez-vous avec des étudiants avancés et des majors de promo pour du mentorat et la résolution collaborative de problèmes.",
      icon: "🤝"
    }
  ];



function CoreService() {


  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
            Notre fondation
          </h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Le cœur d’IUT GATE
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            Nous fournissons les informations essentielles et les outils d’orientation nécessaires pour vous aider à naviguer votre parcours universitaire avec confiance et clarté.
          </p>
        </div>


        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/*rec */}
          {coreFeatures.map((feature, index) => (
            <article 
              key={index}
              className="group relative p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out"
            >
              {/* Icon Placeholder */}
              <div className="w-14 h-14 bg-slate-50 text-3xl flex items-center justify-center rounded-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>


              {/* Text Content */}
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>


              {/* Bottom Accent Decor */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-blue-600 rounded-b-3xl transition-all duration-300"></div>
            </article>
          ))}
        </div>


        {/* Support Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 italic">
            Besoin d’une aide plus spécifique ? <a href="#contact" className="text-blue-600 font-medium hover:underline">Contactez notre service d’assistance</a>
          </p>
        </div>


      </div>
    </section>
  );
};


export default CoreService;
