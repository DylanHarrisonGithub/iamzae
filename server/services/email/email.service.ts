import nodemailer from 'nodemailer';

import config from '../../config/config';

import { Service, ServicePromise } from '../services';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const email = ((): typeof service extends Service ? typeof service : never => {
  const service = async (recipient: string, subject?: string, text?: string, html?: string): ServicePromise<nodemailer.SentMessageInfo> => {
    
    if (!(config.NODEMAILER.EMAIL && config.NODEMAILER.PASSWORD)) {
      return new Promise(res => res({
        success: false,
        messages: [`SERVER - Services - EmailService - Email not configured.`]
      }));
    }

    let mailOptions: SMTPTransport.Options = {
      from: config.APPNAME,
      to: recipient,
      subject: subject? subject : "no subject"
    };
    if (text) {
      mailOptions['text'] = text;
    } else if (!text && html) {
      mailOptions['html'] = html;
    }

    const result = await (nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.NODEMAILER.EMAIL,
        pass: config.NODEMAILER.PASSWORD
      }
    }).sendMail(mailOptions));

    if (result.rejected.length) {
      return new Promise(resolve => resolve({
        success: false,
        messages: [`SERVER - Services - EmailService - Email rejected.`],
        body: result
      })); 
    }

    return new Promise(resolve => resolve({
      success: true,
      messages: [`SERVER - Services - EmailService - Email sent successfully.`],
      body: result
    }));
  }
  return service;
})();


export default email;