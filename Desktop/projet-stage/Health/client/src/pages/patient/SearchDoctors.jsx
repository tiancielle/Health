// // client/src/pages/patient/SearchDoctors.jsx
// import { useState } from 'react';
// import SearchForm from '../../components/forms/searchForm';
// import DoctorCard from '../../components/ui/DoctorCard';
// import { searchDoctors } from '../../services/searchService';

// export default function SearchDoctors() {
//   const [results, setResults] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fonction appelée par SearchForm
//   const handleSearch = async (query, location) => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await searchDoctors(query, location);
//       setResults(data);
//     } catch (err) {
//       setError('Failed to load doctors. Please try again.');
//       setResults(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Find the Right Doctor
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Search for specialists near you and book an appointment in minutes.
//           </p>
//         </div>

//         {/* Formulaire de recherche */}
//         <SearchForm onSearch={handleSearch} />

//         {/* État de chargement */}
//         {loading && (
//           <div className="text-center mt-8">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d89b1]"></div>
//             <p className="mt-2 text-gray-600">Searching doctors...</p>
//           </div>
//         )}

//         {/* Message d'erreur */}
//         {error && (
//           <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
//             {error}
//           </div>
//         )}

//         {/* Résultats */}
//         {results && !loading && (
//           <div className="mt-10">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 {results.total} Doctor(s) Found
//               </h2>
//               <p className="text-sm text-gray-500 mt-2 sm:mt-0">
//                 Showing page {results.page} of {results.totalPages}
//               </p>
//             </div>

//             {results.doctors.length > 0 ? (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {results.doctors.map((doctor) => (
//                   <DoctorCard
//                     key={doctor.id}
//                     doctor={doctor}
//                     onClick={() => {
//                       // Optionnel : rediriger vers le profil du médecin
//                       window.location.href = `/patient/doctor/${doctor.id}`;
//                     }}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-10">
//                 <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500 text-lg">No doctors match your criteria.</p>
//                 <p className="text-gray-400">Try adjusting your search or location.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Importer l'icône si tu veux l'utiliser dans le composant
// import { Search } from 'lucide-react';