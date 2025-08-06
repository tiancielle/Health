// src/services/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config/environment');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: false, // true pour 465, false pour les autres ports
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      // Vérifier la connexion
      if (config.email.user && config.email.password) {
        await this.transporter.verify();
        console.log(' Service email initialisé avec succès');
      } else {
        console.warn(' Configuration email manquante - emails désactivés');
      }
    } catch (error) {
      console.error(' Erreur lors de l\'initialisation du service email:', error.message);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.transporter) {
        console.log(' Email simulé (pas de configuration):', { to, subject });
        return true;
      }

      const mailOptions = {
        from: `"Health System" <${config.email.user}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(' Email envoyé avec succès à:', to);
      return result;
    } catch (error) {
      console.error(' Erreur lors de l\'envoi d\'email:', error);
      throw new Error(`Échec de l'envoi d'email: ${error.message}`);
    }
  }

  // Email de vérification d'adresse
  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Vérification de votre email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Health System</h1>
          </div>
          <div class="content">
            <h2>Vérification de votre adresse email</h2>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit sur Health System. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Vérifier mon email</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p><strong>Ce lien expire dans 24 heures.</strong></p>
            <p>Si vous n'avez pas créé de compte sur Health System, vous pouvez ignorer cet email.</p>
          </div>
          <div class="footer">
            <p>Health System - Système de gestion médicale</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, 'Vérification de votre adresse email', html);
  }

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Réinitialisation de mot de passe</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Health System</h1>
          </div>
          <div class="content">
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
            </p>
            <p>Si le bouton ne fonctionne pas, vous pouvez copier ce lien dans votre navigateur :</p>
            <p style="word-break: break-all;">${resetUrl}</p>
            <div class="warning">
              <strong> Important :</strong> Ce lien expire dans 1 heure pour des raisons de sécurité.
            </div>
            <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.</p>
          </div>
          <div class="footer">
            <p>Health System - Système de gestion médicale</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, 'Réinitialisation de votre mot de passe', html);
  }

  // Email de confirmation de rendez-vous
  async sendAppointmentConfirmation(patientEmail, appointmentDetails) {
    const { doctorName, scheduledAt, type, reason, specialty } = appointmentDetails;
    const appointmentDate = new Date(scheduledAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de rendez-vous</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .appointment-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Rendez-vous confirmé</h1>
          </div>
          <div class="content">
            <h2>Votre rendez-vous a été confirmé</h2>
            <p>Bonjour,</p>
            <p>Nous vous confirmons votre rendez-vous médical :</p>
            
            <div class="appointment-details">
              <div class="detail-row">
                <span class="label"> Médecin :</span>
                <span>Dr. ${doctorName}</span>
              </div>
              <div class="detail-row">
                <span class="label"> Spécialité :</span>
                <span>${specialty}</span>
              </div>
              <div class="detail-row">
                <span class="label"> Date et heure :</span>
                <span>${appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="label"> Type :</span>
                <span>${type}</span>
              </div>
              <div class="detail-row">
                <span class="label"> Motif :</span>
                <span>${reason}</span>
              </div>
            </div>

            <p><strong> Conseils avant votre rendez-vous :</strong></p>
            <ul>
              <li>Arrivez 15 minutes avant l'heure prévue</li>
              <li>Apportez votre carte d'identité et votre carte d'assurance</li>
              <li>Préparez la liste de vos médicaments actuels</li>
              <li>Notez vos questions pour ne rien oublier</li>
            </ul>

            <p>Si vous devez annuler ou reporter ce rendez-vous, merci de nous prévenir au moins 24h à l'avance.</p>
          </div>
          <div class="footer">
            <p>Health System - Système de gestion médicale</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(patientEmail, 'Confirmation de votre rendez-vous médical', html);
  }

  // Email de rappel de rendez-vous
  async sendAppointmentReminder(patientEmail, appointmentDetails) {
    const { doctorName, scheduledAt, specialty } = appointmentDetails;
    const appointmentDate = new Date(scheduledAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Rappel de rendez-vous</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FFC107; color: #333; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .appointment-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1> Rappel de rendez-vous</h1>
          </div>
          <div class="content">
            <h2>N'oubliez pas votre rendez-vous !</h2>
            <p>Bonjour,</p>
            <p>Nous vous rappelons que vous avez un rendez-vous médical demain :</p>
            
            <div class="appointment-info">
              <h3> Dr. ${doctorName}</h3>
              <p><strong>${specialty}</strong></p>
              <p><strong> ${appointmentDate}</strong></p>
            </div>

            <p>Merci de confirmer votre présence ou de nous contacter si vous devez reporter ce rendez-vous.</p>
          </div>
          <div class="footer">
            <p>Health System - Système de gestion médicale</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(patientEmail, 'Rappel : Rendez-vous médical demain', html);
  }

  // Email d'annulation de rendez-vous
  async sendAppointmentCancellation(patientEmail, appointmentDetails) {
    const { doctorName, scheduledAt, cancelReason } = appointmentDetails;
    const appointmentDate = new Date(scheduledAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Annulation de rendez-vous</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .cancelled-info { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f44336; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Rendez-vous annulé</h1>
          </div>
          <div class="content">
            <h2>Votre rendez-vous a été annulé</h2>
            <p>Bonjour,</p>
            <p>Nous vous informons que votre rendez-vous suivant a été annulé :</p>
            
            <div class="cancelled-info">
              <p><strong> Médecin :</strong> Dr. ${doctorName}</p>
              <p><strong> Date :</strong> ${appointmentDate}</p>
              ${cancelReason ? `<p><strong>💭 Raison :</strong> ${cancelReason}</p>` : ''}
            </div>

            <p>Si vous souhaitez reprendre un nouveau rendez-vous, n'hésitez pas à nous contacter ou à utiliser notre plateforme en ligne.</p>
            <p>Nous nous excusons pour tout désagrément causé.</p>
          </div>
          <div class="footer">
            <p>Health System - Système de gestion médicale</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(patientEmail, 'Annulation de votre rendez-vous médical', html);
  }

  // Utilitaire pour supprimer les balises HTML
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}

module.exports = new EmailService();