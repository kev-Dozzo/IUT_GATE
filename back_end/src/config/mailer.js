const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0c1a40, #0e3460); padding: 32px 24px; text-align: center; }
    .header h1 { color: #06B6D4; font-size: 24px; margin: 0; }
    .header p  { color: rgba(255,255,255,.7); font-size: 13px; margin: 8px 0 0; }
    .body   { padding: 32px 24px; color: #334155; line-height: 1.7; }
    .btn    { display: inline-block; padding: 12px 24px; background: #06B6D4; color: #0c1a40; border-radius: 8px; text-decoration: none; font-weight: 700; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>IUT GATE</h1>
      <p>Portail Numérique de l'IUT de Douala</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      © ${new Date().getFullYear()} IUT de Douala · <a href="https://iut-dla.com" style="color:#06B6D4">iut-dla.com</a>
    </div>
  </div>
</body>
</html>
`;

// Envoyer un email
const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"IUTGate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email envoyé à ${to}`);
  } catch (err) {
    console.error(`❌ Erreur email à ${to}:`, err.message);
  }
};

// ── Templates ──

// Bienvenue nouvel admin
const sendWelcomeAdmin = (adminEmail, adminNom, role, permissions) =>
  sendMail({
    to: adminEmail,
    subject: "🎉 Bienvenue sur IUT GATE - Votre accès administrateur",
    html: baseTemplate(`
      <h2>Bienvenue, ${adminNom} !</h2>
      <p>Votre compte administrateur a été créé sur le portail IUTGate de l'IUT de Douala.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#64748b;font-size:13px">Email</td><td style="padding:8px;font-weight:600">${adminEmail}</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;color:#64748b;font-size:13px">Rôle</td><td style="padding:8px;font-weight:600;text-transform:capitalize">${role}</td></tr>
        <tr><td style="padding:8px;color:#64748b;font-size:13px">Permissions</td><td style="padding:8px;font-size:13px">${Array.isArray(permissions) ? permissions.join(", ") : permissions}</td></tr>
      </table>
      <p>Vous pouvez vous connecter à votre tableau de bord ici :</p>
      <a href="https://iut-dla.com/admin/login" class="btn">Accéder au Dashboard →</a>
      <p style="font-size:12px;color:#94a3b8;margin-top:24px">Si vous n'attendiez pas ce message, ignorez cet email.</p>
    `),
  });

// Notification au super admin
const sendNewAdminNotif = (superAdminEmail, newAdmin) =>
  sendMail({
    to: superAdminEmail,
    subject: `👤 Nouvel administrateur créé — ${newAdmin.nom}`,
    html: baseTemplate(`
      <h2>Nouvel administrateur créé</h2>
      <p>Un nouveau compte administrateur a été créé sur IUT GATE.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px;color:#64748b;font-size:13px">Nom</td><td style="padding:8px;font-weight:600">${newAdmin.nom}</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;color:#64748b;font-size:13px">Email</td><td style="padding:8px">${newAdmin.email}</td></tr>
        <tr><td style="padding:8px;color:#64748b;font-size:13px">Rôle</td><td style="padding:8px;text-transform:capitalize">${newAdmin.role}</td></tr>
      </table>
      <a href="https://iut-dla.com/admin/utilisateurs" class="btn">Gérer les utilisateurs →</a>
    `),
  });

// Newsletter — nouvelle publication
const sendNewsletter = async (abonnes, sujet, titre, description, lien) => {
  for (const abonne of abonnes) {
    await sendMail({
      to: abonne.email,
      subject: ` IUT GATE - ${sujet}`,
      html: baseTemplate(`
        <h2>${titre}</h2>
        <p>${description || ""}</p>
        <a href="${lien}" class="btn">Voir la publication →</a>
        <p style="font-size:11px;color:#94a3b8;margin-top:32px">
          Vous recevez cet email car vous êtes abonné à la newsletter IUT GATE.<br>
          <a href="https://iut-dla.com/newsletter/unsubscribe?token=${abonne.token}" style="color:#94a3b8">Se désabonner</a>
        </p>
      `),
    });
    // Délai pour éviter le spam
    await new Promise((r) => setTimeout(r, 200));
  }
};

module.exports = {
  sendMail,
  sendWelcomeAdmin,
  sendNewAdminNotif,
  sendNewsletter,
  baseTemplate,
};
