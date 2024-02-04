import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 465,
    secure: true,
    auth:{
        user: 'adilamillath@gmail.com',
        pass:'zmft umhx riio iqnw'
    }
})

export default transporter;