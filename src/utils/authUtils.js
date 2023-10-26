import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const secretKey = 'd33d39177bb7e0d63657463798d4e7eb3e11b1e20656a646cfb110e1d453e466';

export async function sendPasswordResetEmail(mail, datosLogin) {

  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'medusic-app@outlook.com',
      pass: 'jellyfish-000',
    },
  });

  // Contenido del correo electrónico
  const mailOptions = {
    from: 'Medusic <medusic-app@outlook.com>',
    to: mail,
    subject: 'Recordatorio de credenciales en Medusic',
    html: `<p>Estimado/a ${datosLogin.fullname},</p>
    <p>Le recordamos los datos de su cuenta en Medusic:</p>
    <ul>
      <li><strong>Nombre de usuario:</strong> ${datosLogin.username}</li>
      <li><strong>Contraseña:</strong> ${datosLogin.passw}</li>
    </ul>
    <p>Le recomendamos mantener esta información de forma segura y no compartirla con nadie.</p>
    <p>Si tiene alguna pregunta o necesita asistencia, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
    <p>Atentamente,</p>
    <p>Equipo de Medusic</p>`,
  };

  // Enviar el correo electrónico
  await transporter.sendMail(mailOptions);
}

export function generateToken(idUsuario, time) {
  const token = jwt.sign({ idUsuario }, secretKey, { expiresIn: time });
  return token;
}

export default generateToken;