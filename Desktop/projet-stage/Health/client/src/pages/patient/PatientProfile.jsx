// client/src/pages/patient/PatientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Calendar, MapPin, Droplet, Heart, Shield, Save, X, Edit3, LogOut, Mail, Lock } from 'lucide-react';
import Header from '../../components/layout/Header';

const PatientProfile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // État du profil avec tous les champs
  const [profileData, setProfileData] = useState({
    // Champs non modifiables (de l'inscription)
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    
    // Champs modifiables
    phone: '',
    address: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    preferredLanguage: 'French',
    insuranceProvider: '',
    insuranceNumber: '',
    height: '',
    weight: ''
  });

  // Charger les données du profil au montage du composant
  useEffect(() => {
    if (currentUser) {
      // Charger les données d'inscription depuis currentUser
      setProfileData(prevData => ({
        ...prevData,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        dateOfBirth: currentUser.dateOfBirth ? 
          (currentUser.dateOfBirth instanceof Date ? 
            currentUser.dateOfBirth.toISOString().split('T')[0] : 
            new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
          ) : '',
        gender: currentUser.gender || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      }));
      
      // Charger les données additionnelles depuis localStorage
      loadAdditionalProfileData();
    }
  }, [currentUser]);

  // Fonction pour charger les données additionnelles depuis localStorage
  const loadAdditionalProfileData = () => {
    try {
      const savedProfile = localStorage.getItem(`patient_profile_${currentUser?.email}`);
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setProfileData(prevData => ({
          ...prevData,
          ...data
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil depuis localStorage:', error);
    }
  };

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Sauvegarder les modifications dans localStorage
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Préparer les données modifiables à sauvegarder
      const editableData = {
        phone: profileData.phone,
        address: profileData.address,
        bloodType: profileData.bloodType,
        emergencyContactName: profileData.emergencyContactName,
        emergencyContactPhone: profileData.emergencyContactPhone,
        emergencyContactRelation: profileData.emergencyContactRelation,
        allergies: profileData.allergies,
        chronicConditions: profileData.chronicConditions,
        currentMedications: profileData.currentMedications,
        preferredLanguage: profileData.preferredLanguage,
        insuranceProvider: profileData.insuranceProvider,
        insuranceNumber: profileData.insuranceNumber,
        height: profileData.height,
        weight: profileData.weight
      };

      // Sauvegarder dans localStorage avec une clé unique basée sur l'email
      localStorage.setItem(`patient_profile_${currentUser.email}`, JSON.stringify(editableData));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Annuler les modifications
  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    
    // Recharger les données de base depuis currentUser (base de données)
    if (currentUser) {
      setProfileData(prevData => ({
        ...prevData,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        dateOfBirth: currentUser.dateOfBirth ? 
          (currentUser.dateOfBirth instanceof Date ? 
            currentUser.dateOfBirth.toISOString().split('T')[0] : 
            new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
          ) : '',
        gender: currentUser.gender || ''
      }));
      
      // Recharger les données additionnelles depuis localStorage
      loadAdditionalProfileData();
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculer l'âge
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Vérifier si currentUser existe
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-[#4d89b1] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600">Patient Profile</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] transition"
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Messages de succès/erreur */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles (non modifiables) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-gray-400" />
              Personal Information
              <span className="text-sm text-gray-500 font-normal ml-2">(Read only)</span>
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.lastName}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {profileData.email || 'Non renseigné'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date of Birth
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {calculateAge(profileData.dateOfBirth)} years
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {profileData.gender || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Informations de contact (modifiables) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-[#4d89b1]" />
              Contact Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.phone || 'Not specified'}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your full address"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                    {profileData.address || 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                {isEditing ? (
                  <select
                    name="preferredLanguage"
                    value={profileData.preferredLanguage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  >
                    <option value="French">Français</option>
                    <option value="Arabic">العربية</option>
                    <option value="English">English</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.preferredLanguage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations médicales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Medical Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Droplet className="h-4 w-4 mr-1 text-red-600" />
                    Blood Type
                  </label>
                  {isEditing ? (
                    <select
                      name="bloodType"
                      value={profileData.bloodType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                    >
                      <option value="">Select blood type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {profileData.bloodType || 'Not specified'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="height"
                      value={profileData.height}
                      onChange={handleInputChange}
                      placeholder="170"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {profileData.height ? `${profileData.height} cm` : 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="weight"
                    value={profileData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.weight ? `${profileData.weight} kg` : 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                {isEditing ? (
                  <textarea
                    name="allergies"
                    value={profileData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies (medications, food, environmental)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                    {profileData.allergies || 'None specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                {isEditing ? (
                  <textarea
                    name="chronicConditions"
                    value={profileData.chronicConditions}
                    onChange={handleInputChange}
                    placeholder="List any chronic conditions or ongoing health issues..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                    {profileData.chronicConditions || 'None specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                {isEditing ? (
                  <textarea
                    name="currentMedications"
                    value={profileData.currentMedications}
                    onChange={handleInputChange}
                    placeholder="List current medications and dosages..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[80px]">
                    {profileData.currentMedications || 'None specified'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact d'urgence */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-orange-500" />
              Emergency Contact
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.emergencyContactName || 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={profileData.emergencyContactPhone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.emergencyContactPhone || 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                {isEditing ? (
                  <select
                    name="emergencyContactRelation"
                    value={profileData.emergencyContactRelation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  >
                    <option value="">Select relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.emergencyContactRelation || 'Not specified'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assurance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Insurance Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={profileData.insuranceProvider}
                    onChange={handleInputChange}
                    placeholder="e.g. CNSS, CNOPS, Private Insurance"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.insuranceProvider || 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="insuranceNumber"
                    value={profileData.insuranceNumber}
                    onChange={handleInputChange}
                    placeholder="Insurance policy number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {profileData.insuranceNumber || 'Not specified'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        {isEditing && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 bg-[#4d89b1] text-white px-6 py-3 rounded-lg hover:bg-[#3d6c91] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bouton de déconnexion */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;