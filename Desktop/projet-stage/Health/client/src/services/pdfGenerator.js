// client/src/services/pdfGenerator.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Service pour générer des PDFs professionnels des records médicaux
export class MedicalPDFGenerator {
  
  constructor() {
    // Configuration par défaut
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    
    // Couleurs Health
    this.colors = {
      primary: '#4d89b1',
      secondary: '#3d6c91',
      text: '#1f2937',
      lightGray: '#f3f4f6',
      border: '#e5e7eb'
    };
  }

  // Fonction principale pour générer le PDF
  async generateMedicalRecordPDF(record, patientInfo = null) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Informations par défaut du patient si non fournies
    const patient = patientInfo || {
      name: 'M. Ahmed Benali',
      dateOfBirth: '15/03/1985',
      patientId: 'PAT-2025-001',
      address: 'Casablanca, Maroc',
      phone: '+212 6 12 34 56 78'
    };

    try {
      // Créer le contenu HTML temporaire pour la conversion
      const htmlContent = this.createHTMLContent(record, patient);
      
      // Créer un élément temporaire dans le DOM
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '794px'; // A4 width in pixels (210mm * 3.78)
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      document.body.appendChild(tempDiv);

      // Convertir HTML en canvas puis en PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123 // A4 height in pixels
      });

      document.body.removeChild(tempDiv);

      // Calculer les dimensions pour le PDF
      const imgWidth = this.pageWidth - (this.margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ajouter l'image au PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        this.margin,
        this.margin,
        imgWidth,
        imgHeight
      );

      // Sauvegarder le PDF
      const fileName = `Health_${record.type}_${record.title.replace(/\s+/g, '_')}_${record.date}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Fallback vers méthode basique
      this.generateBasicPDF(record, patient);
    }
  }

  // Créer le contenu HTML pour la conversion
  createHTMLContent(record, patient) {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const recordDate = new Date(record.date).toLocaleDateString('fr-FR');

    return `
      <div style="max-width: 794px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        
        <!-- Header avec logo Health -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid ${this.colors.primary};">
          <div style="display: flex; align-items: center;">
            <div style="width: 50px; height: 50px; background-color: ${this.colors.primary}; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">♥</span>
            </div>
            <div>
              <h1 style="font-size: 28px; font-weight: bold; color: ${this.colors.text}; margin: 0;">Health</h1>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Système de Santé Intelligent</p>
            </div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Date d'émission: ${currentDate}</p>
            <p style="margin: 0;">Document ID: ${record.id}-${Date.now()}</p>
          </div>
        </div>

        <!-- Informations Médecin -->
        <div style="background-color: ${this.colors.lightGray}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: ${this.colors.primary}; margin: 0 0 10px 0; font-size: 16px;">Médecin Prescripteur</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 5px 0;"><strong>${record.doctor}</strong></p>
              <p style="margin: 5px 0; color: #6b7280;">${record.specialty}</p>
              <p style="margin: 5px 0; color: #6b7280;">Licence: MED-${Math.floor(Math.random() * 10000)}</p>
            </div>
            <div>
              <p style="margin: 5px 0; color: #6b7280;">${record.location}</p>
              <p style="margin: 5px 0; color: #6b7280;">Tél: +212 5 22 XX XX XX</p>
              <p style="margin: 5px 0; color: #6b7280;">Email: contact@health.ma</p>
            </div>
          </div>
        </div>

        <!-- Informations Patient -->
        <div style="background-color: white; border: 2px solid ${this.colors.border}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: ${this.colors.primary}; margin: 0 0 10px 0; font-size: 16px;">Informations Patient</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <p style="margin: 5px 0;"><strong>Nom:</strong> ${patient.name}</p>
              <p style="margin: 5px 0;"><strong>Date de naissance:</strong> ${patient.dateOfBirth}</p>
              <p style="margin: 5px 0;"><strong>ID Patient:</strong> ${patient.patientId}</p>
            </div>
            <div>
              <p style="margin: 5px 0;"><strong>Adresse:</strong> ${patient.address}</p>
              <p style="margin: 5px 0;"><strong>Téléphone:</strong> ${patient.phone}</p>
              <p style="margin: 5px 0;"><strong>Date consultation:</strong> ${recordDate}</p>
            </div>
          </div>
        </div>

        <!-- Titre du document -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-size: 24px; color: ${this.colors.primary}; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
            ${this.getDocumentTitle(record.type)}
          </h2>
          <p style="margin: 5px 0; color: #6b7280;">${record.title}</p>
        </div>

        <!-- Contenu principal selon le type -->
        <div style="margin-bottom: 40px;">
          ${this.generateContentByType(record)}
        </div>

        <!-- Notes et recommandations -->
        <div style="background-color: #fef3cd; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 30px;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">Notes importantes:</h4>
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            ${this.getImportantNotes(record)}
          </p>
        </div>

        <!-- Footer avec signature -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid ${this.colors.border};">
          <div style="display: flex; justify-content: space-between; align-items: end;">
            <div>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Ce document a été généré électroniquement par le système Health
              </p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">
                Validité: 30 jours à partir de la date d'émission
              </p>
            </div>
            <div style="text-align: right;">
              <div style="display: flex; align-items: center; justify-content: flex-end; margin-bottom: 10px;">
                <span style="margin-right: 10px; color: ${this.colors.primary}; font-size: 20px;">🔒</span>
                <span style="font-weight: bold; color: ${this.colors.primary};">Signature Numérique Health</span>
              </div>
              <p style="margin: 0; font-size: 10px; color: #6b7280;">
                Certifié par: Équipe Médicale Health • ${currentDate}
              </p>
            </div>
          </div>
        </div>

        <!-- Code QR simulé -->
        <div style="text-align: center; margin-top: 20px;">
          <div style="width: 60px; height: 60px; background-color: ${this.colors.text}; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 8px;">
            QR
          </div>
          <p style="margin: 5px 0 0 0; font-size: 10px; color: #6b7280;">
            Code de vérification: ${record.id}${Date.now()}
          </p>
        </div>
      </div>
    `;
  }

  // Générer le contenu selon le type de record
  generateContentByType(record) {
    switch (record.type) {
      case 'prescription':
        return this.generatePrescriptionContent(record);
      case 'analysis':
        return this.generateAnalysisContent(record);
      case 'report':
        return this.generateReportContent(record);
      case 'consultation':
        return this.generateConsultationContent(record);
      default:
        return `<p>${record.description}</p>`;
    }
  }

  // Contenu pour prescription
  generatePrescriptionContent(record) {
    if (!record.prescription) return `<p>${record.description}</p>`;

    let content = '<div style="background-color: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px;">';
    content += '<h4 style="color: #059669; margin: 0 0 20px 0;">Médicaments prescrits:</h4>';

    record.prescription.medications.forEach((med, index) => {
      content += `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f0fdf4; border-radius: 6px; border-left: 4px solid #10b981;">
          <h5 style="margin: 0 0 10px 0; color: #047857; font-size: 16px;">${index + 1}. ${med.name} ${med.dosage}</h5>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px;">
            <p style="margin: 0;"><strong>Fréquence:</strong> ${med.frequency}</p>
            <p style="margin: 0;"><strong>Durée:</strong> ${med.duration}</p>
            <p style="margin: 0;"><strong>Quantité:</strong> ${med.quantity}</p>
            <p style="margin: 0;"><strong>Renouvellements:</strong> ${record.prescription.refills}</p>
          </div>
          <div style="background-color: #fef3cd; padding: 10px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Instructions:</strong> ${med.instructions}</p>
          </div>
        </div>
      `;
    });

    if (record.prescription.notes) {
      content += `
        <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 6px;">
          <h5 style="color: #1d4ed8; margin: 0 0 10px 0;">Notes du médecin:</h5>
          <p style="margin: 0; color: #1e40af;">${record.prescription.notes}</p>
        </div>
      `;
    }

    content += '</div>';
    return content;
  }

  // Contenu pour analyse
  generateAnalysisContent(record) {
    if (!record.results) return `<p>${record.description}</p>`;

    let content = '<div style="background-color: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px;">';
    
    if (record.results.summary) {
      content += `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
          <h4 style="color: #1d4ed8; margin: 0 0 10px 0;">Résumé:</h4>
          <p style="margin: 0; color: #1e40af;">${record.results.summary}</p>
        </div>
      `;
    }

    content += '<h4 style="color: #1d4ed8; margin: 0 0 15px 0;">Résultats détaillés:</h4>';
    content += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
    content += `
      <tr style="background-color: #f8fafc;">
        <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; color: #374151; font-weight: bold;">Paramètre</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; color: #374151; font-weight: bold;">Valeur</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; color: #374151; font-weight: bold;">Référence</th>
        <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; color: #374151; font-weight: bold;">Statut</th>
      </tr>
    `;

    record.results.details.forEach((item, index) => {
      const statusColor = item.status === 'excellent' ? '#059669' : 
                         item.status === 'normal' ? '#10b981' : 
                         item.status === 'warning' ? '#f59e0b' : '#ef4444';
      
      content += `
        <tr style="${index % 2 === 0 ? 'background-color: #f9fafb;' : 'background-color: white;'}">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 500;">${item.parameter}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: ${statusColor};">${item.value}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; color: #6b7280;">${item.range}</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">
            <span style="color: ${statusColor}; font-weight: 500; text-transform: capitalize;">
              ${item.status === 'excellent' ? '✓ Excellent' : 
                item.status === 'normal' ? '✓ Normal' : 
                item.status === 'warning' ? '⚠ Attention' : '✗ Critique'}
            </span>
          </td>
        </tr>
      `;
    });

    content += '</table>';

    if (record.results.notes) {
      content += `
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px;">
          <h5 style="color: #1d4ed8; margin: 0 0 10px 0;">Notes du médecin:</h5>
          <p style="margin: 0; color: #1e40af;">${record.results.notes}</p>
        </div>
      `;
    }

    content += '</div>';
    return content;
  }

  // Contenu pour rapport
  generateReportContent(record) {
    if (!record.report) return `<p>${record.description}</p>`;

    let content = '<div style="background-color: white; border: 2px solid #8b5cf6; border-radius: 8px; padding: 20px;">';
    
    content += `
      <div style="background-color: #f5f3ff; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #8b5cf6;">
        <h4 style="color: #7c3aed; margin: 0 0 10px 0;">Observations:</h4>
        <p style="margin: 0; color: #6d28d9;">${record.report.findings}</p>
      </div>
    `;

    content += '<h4 style="color: #7c3aed; margin: 0 0 15px 0;">Recommandations:</h4>';
    content += '<ul style="padding-left: 20px;">';
    
    record.report.recommendations.forEach(rec => {
      content += `<li style="margin: 8px 0; color: #374151;">${rec}</li>`;
    });
    
    content += '</ul>';

    if (record.report.images) {
      content += `
        <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 0; color: #374151;"><strong>Images cliniques incluses:</strong> ${record.report.images} photographies</p>
        </div>
      `;
    }

    content += '</div>';
    return content;
  }

  // Contenu pour consultation
  generateConsultationContent(record) {
    if (!record.consultation) return `<p>${record.description}</p>`;

    let content = '<div style="background-color: white; border: 2px solid #f97316; border-radius: 8px; padding: 20px;">';
    
    content += `
      <div style="background-color: #fff7ed; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f97316;">
        <h4 style="color: #ea580c; margin: 0 0 10px 0;">Motif de consultation:</h4>
        <p style="margin: 0; color: #c2410c;">${record.consultation.chiefComplaint}</p>
      </div>
    `;

    content += '<h4 style="color: #ea580c; margin: 0 0 15px 0;">Signes vitaux:</h4>';
    content += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">';
    
    Object.entries(record.consultation.vitals).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      content += `
        <div style="background-color: #f9fafb; padding: 10px; border-radius: 6px; text-align: center;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">${label}</p>
          <p style="margin: 0; font-weight: bold; color: #374151;">${value}</p>
        </div>
      `;
    });
    
    content += '</div>';

    content += `
      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
        <h5 style="color: #166534; margin: 0 0 10px 0;">Évaluation:</h5>
        <p style="margin: 0; color: #15803d;">${record.consultation.assessment}</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px;">
        <h5 style="color: #1d4ed8; margin: 0 0 10px 0;">Plan de traitement:</h5>
        <p style="margin: 0; color: #1e40af;">${record.consultation.plan}</p>
      </div>
    `;

    content += '</div>';
    return content;
  }

  // Obtenir le titre du document
  getDocumentTitle(type) {
    switch (type) {
      case 'prescription': return 'Ordonnance Médicale';
      case 'analysis': return 'Rapport d\'Analyse';
      case 'report': return 'Rapport Médical';
      case 'consultation': return 'Compte-Rendu de Consultation';
      default: return 'Document Médical';
    }
  }

  // Obtenir les notes importantes
  getImportantNotes(record) {
    switch (record.type) {
      case 'prescription':
        return 'Respecter la posologie prescrite. En cas d\'effets secondaires, consulter immédiatement votre médecin.';
      case 'analysis':
        return 'Ces résultats doivent être interprétés par votre médecin traitant dans le contexte de votre état clinique.';
      case 'report':
        return 'Ce rapport nécessite un suivi médical approprié. Respecter les recommandations données.';
      case 'consultation':
        return 'Suivre les recommandations données. Prendre rendez-vous pour le suivi si nécessaire.';
      default:
        return 'Document à conserver dans votre dossier médical personnel.';
    }
  }

  // Méthode de fallback pour PDF basique
  generateBasicPDF(record, patient) {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(77, 137, 177); // Health blue
    pdf.text('Health - Système de Santé', 20, 20);
    
    // Title
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(this.getDocumentTitle(record.type), 20, 40);
    
    // Content
    pdf.setFontSize(12);
    pdf.text(`Patient: ${patient.name}`, 20, 60);
    pdf.text(`Médecin: ${record.doctor}`, 20, 70);
    pdf.text(`Date: ${record.date}`, 20, 80);
    pdf.text(`Description: ${record.description}`, 20, 90);
    
    // Save
    pdf.save(`Health_${record.type}_${record.date}.pdf`);
  }
}

// Export de l'instance
export const pdfGenerator = new MedicalPDFGenerator();