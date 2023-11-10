import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export const secretKey = 'd33d39177bb7e0d63657463798d4e7eb3e11b1e20656a646cfb110e1d453e466';

export async function sendPasswordResetEmail(mail, datosLogin) {

  const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'medusic-app@outlook.com',
      pass: 'jellyfish-000',
    },
  });

  const resetToken = generateToken(datosLogin.idUsuario, '1h');

  // Contenido del correo electrónico
  const mailOptions = {
    from: 'Medusic <medusic-app@outlook.com>',
    to: mail,
    subject: 'Restablecer contraseña en Medusic',
    html: `<p>Estimado/a ${datosLogin.fullname},</p>
    <p>A continuación, le vamos a proporcionar un enlace para que pueda restablecer su contraseña</p>
    
    <p>http://localhost:4200/auth/reset-password?token=${resetToken}</p>

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