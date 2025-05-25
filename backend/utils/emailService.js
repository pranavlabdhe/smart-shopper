// // utils/emailService.js
// const nodemailer = require('nodemailer');

// exports.sendPriceDropEmail = async (email, product) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
//     }
//   });

//   const mailOptions = {
//     from: `Price Tracker ${process.env.EMAIL_USER}`,
//     to: email,
//     subject: `🔥 Price Drop Alert: ${product.productName}`,
//     html: `
//       <h2>Your tracked product is now under your budget!</h2>
//       <p><a href="${product.platform}">${product.productName}</a></p>
//       <p>Desired Price: ₹${product.desiredPrice}</p>
//       <p>Go grab it now!</p>
//     `
//   };

//   await transporter.sendMail(mailOptions);
// };



const nodemailer = require('nodemailer');

exports.sendPriceDropEmail = async (email, product) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Price Tracker <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🔥 Price Drop Alert: ${product.productName}`,
    html: `
      <h2>Great News! Your tracked product is now below your desired price.</h2>
      <p><strong>Product:</strong> <a href="${product.platform}" target="_blank">${product.productName}</a></p>
      <p><strong>Target Price:</strong> ₹${product.desiredPrice}</p>
      <p><strong>Now Available Below This Price!</strong></p>
      <p><a href="${product.platform}" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none;">Buy Now</a></p>
    `
  };

  await transporter.sendMail(mailOptions);
};
