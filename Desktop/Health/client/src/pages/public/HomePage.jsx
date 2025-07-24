import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Star, Shield, Users, Activity, ChevronRight, Menu, X } from 'lucide-react';

export default function HealthHomepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const specialties = [
    { name: 'Médecin généraliste', icon: '🩺', count: '2,847' },
    { name: 'Dentiste', icon: '🦷', count: '1,234' },
    { name: 'Cardiologue', icon: '❤️', count: '567' },
    { name: 'Dermatologue', icon: '🧴', count: '432' },
    { name: 'Gynécologue', icon: '👩‍⚕️', count: '389' },
    { name: 'Ophtalmologue', icon: '👁️', count: '298' }
  ];

  const stats = [
    { label: 'Patients actifs', value: '50,000+', icon: Users },
    { label: 'Médecins partenaires', value: '5,000+', icon: Activity },
    { label: 'RDV pris par jour', value: '15,000+', icon: Calendar },
    { label: 'Satisfaction patient', value: '4.8/5', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      rating: 5,
      text: 'Interface très intuitive, j\'ai pu prendre RDV en quelques clics !',
      specialty: 'Patiente'
    },
    {
      name: 'Dr. Jean Martin',
      rating: 5,
      text: 'Excellente plateforme pour gérer mes consultations et mes patients.',
      specialty: 'Cardiologue'
    },
    {
      name: 'Sophie Laurent',
      rating: 5,
      text: 'Mes dossiers médicaux sont enfin centralisés et sécurisés.',
      specialty: 'Patiente'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">Health</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">
                Trouver un médecin
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">
                Pour les médecins
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition">
                À propos
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition">
                Se connecter
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                S'inscrire
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Trouver un médecin</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pour les médecins</a>
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600">À propos</a>
                <div className="pt-4 pb-2 border-t border-gray-100">
                  <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600">
                    Se connecter
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-blue-600 font-medium">
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre santé,
              <span className="text-blue-600 block">notre priorité</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Prenez rendez-vous en ligne avec des milliers de professionnels de santé. 
              Gérez vos dossiers médicaux en toute sécurité.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Que recherchez-vous ?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Médecin, spécialité, établissement..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Où ?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ville, code postal"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
            </div>
            
            <button className="w-full mt-8 bg-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02]">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trouvez le bon spécialiste
            </h2>
            <p className="text-xl text-gray-600">
              Accès immédiat à tous les professionnels de santé près de chez vous
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="text-4xl mb-4">{specialty.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {specialty.name}
                </h3>
                <p className="text-sm text-gray-500">{specialty.count} médecins</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Health ?
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme moderne pour une prise en charge optimale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="bg-blue-100 rounded-2xl p-4 w-fit mb-6">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Réservation instantanée
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Prenez rendez-vous 24h/24 et 7j/7 avec vos professionnels de santé préférés. 
                Confirmation immédiate et rappels automatiques.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="bg-green-100 rounded-2xl p-4 w-fit mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Données sécurisées
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Vos informations médicales sont protégées par un chiffrement de niveau bancaire. 
                Conformité RGPD garantie.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="bg-purple-100 rounded-2xl p-4 w-fit mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Gain de temps
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fini les appels téléphoniques et les files d'attente. 
                Gérez tous vos rendez-vous depuis une seule plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 text-white mx-auto mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Plus de 50 000 patients et 5 000 médecins nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à Health pour leur santé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
              Je suis un patient
            </button>
            <button className="bg-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-900 transition-all duration-200 transform hover:scale-105">
              Je suis un médecin
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Activity className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-2xl font-bold">Health</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La plateforme qui révolutionne la prise de rendez-vous médicaux et la gestion des dossiers patients.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Patients</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Prendre RDV</a></li>
                <li><a href="#" className="hover:text-white transition">Mes consultations</a></li>
                <li><a href="#" className="hover:text-white transition">Dossier médical</a></li>
                <li><a href="#" className="hover:text-white transition">Aide</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Médecins</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Inscription</a></li>
                <li><a href="#" className="hover:text-white transition">Planning</a></li>
                <li><a href="#" className="hover:text-white transition">Patients</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">À propos</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Notre mission</a></li>
                <li><a href="#" className="hover:text-white transition">Sécurité</a></li>
                <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Health. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white transition">CGU</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}