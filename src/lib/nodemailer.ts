import nodemailer from "nodemailer";

// A test account from Ethereal (email testing service)
// TODO: Whenever i want to go live, i will change this configuration to real email service like SendGrid or Amazon SES (development purpose only)

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "jarrett.stoltenberg@ethereal.email",
    pass: "kdbPnxRasReQv5ECey",
  },
});

export { transporter };