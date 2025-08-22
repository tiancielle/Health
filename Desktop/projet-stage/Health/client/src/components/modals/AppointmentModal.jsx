// client/src/components/modals/AppointmentModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../ui/modal';
import { Calendar, Clock, MapPin, Phone, CreditCard, User } from 'lucide-react';
import doctorService from '../../services/doctorService';

export default function AppointmentModal({ isOpen, onClose, doctor }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Patient Info, 3: Confirmation
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    reason: ''
  });

  // Générer les 7 prochains jours
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    }
    return dates;
  };

  // Créneaux horaires disponibles (exemple)
  const getTimeSlots = (date) => {
    // Dans une vraie app, ceci viendrait de l'API
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
    
    // Simuler quelques créneaux occupés
    const occupiedSlots = ['10:30', '15:00', '16:30'];
    
    return slots.map(slot => ({
      time: slot,
      available: !occupiedSlots.includes(slot)
    }));
  };

  useEffect(() => {
    if (selectedDate) {
      setAvailableSlots(getTimeSlots(selectedDate));
      setSelectedTime('');
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    try {
      // Ici vous appelleriez votre API pour créer le rendez-vous
      console.log('Booking appointment:', {
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
        patientInfo
      });
      
      // Simuler une attente
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Appointment booked successfully!');
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setPatientInfo({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      reason: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!doctor) return null;

  const dates = getAvailableDates();
  const selectedDateObj = dates.find(d => d.value === selectedDate);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="large"
      title={`Book Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`}
    >
      {/* Doctor Info Header */}
      <div className="bg-gray-50 -mx-6 -mt-6 mb-6 p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#4d89b1] flex items-center justify-center text-white font-bold text-xl">
            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-gray-600">{doctor.specialty}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {doctor.address}
            </div>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= stepNumber 
                ? 'bg-[#4d89b1] text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNumber ? 'bg-[#4d89b1]' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Select Date & Time</h4>
          
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Date
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {dates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => handleDateChange(date.value)}
                  className={`
                    p-3 text-left rounded-lg border transition-colors
                    ${selectedDate === date.value
                      ? 'border-[#4d89b1] bg-blue-50 text-[#4d89b1]'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{date.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Times for {selectedDateObj?.full}
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-lg text-sm font-medium transition-colors
                      ${!slot.available
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : selectedTime === slot.time
                          ? 'bg-[#4d89b1] text-white'
                          : 'border border-gray-200 hover:border-[#4d89b1] hover:text-[#4d89b1]'
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Patient Information</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={patientInfo.firstName}
                  onChange={(e) => handlePatientInfoChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={patientInfo.lastName}
                  onChange={(e) => handlePatientInfoChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => handlePatientInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  placeholder="+212 XXX XXX XXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => handlePatientInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <textarea
                value={patientInfo.reason}
                onChange={(e) => handlePatientInfoChange('reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                rows="3"
                placeholder="Brief description of your health concern..."
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Confirm Appointment</h4>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Doctor:</span>
              <span className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{selectedDateObj?.full}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{patientInfo.firstName} {patientInfo.lastName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{patientInfo.phone}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Fee:</span>
              <span className="font-medium text-[#4d89b1]">{doctor.consultationPrice || 300} MAD</span>
            </div>
          </div>

          {patientInfo.reason && (
            <div className="mt-4">
              <span className="text-gray-600 text-sm">Reason for visit:</span>
              <p className="text-gray-800 mt-1">{patientInfo.reason}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
        <div>
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Previous
            </button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!selectedDate || !selectedTime)) ||
                (step === 2 && (!patientInfo.firstName || !patientInfo.lastName || !patientInfo.phone))
              }
              className="px-6 py-2 bg-[#4d89b1] text-white rounded-lg hover:bg-[#3d6c91] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleBookAppointment}
              disabled={loading}
              className="px-6 py-2 bg-[#4d89b1] text-white rounded-lg hover:bg-[#3d6c91] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}