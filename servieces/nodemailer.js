import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 465,
    secure: true,
    auth:{
        user: 'alltrackerx@gmail.com',
        pass:'vdmn vlir agvf vfld'
    }
})

export default transporter;