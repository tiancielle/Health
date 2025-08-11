// client/src/services/searchService.js
export const searchDoctors = async (query, location) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);

    const response = await fetch(`/api/doctors?${params}`);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur searchDoctors:', error);
    throw error;
  }
};