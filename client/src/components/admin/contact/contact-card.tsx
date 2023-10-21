// Contact.tsx
import React from "react";

interface Contact {
  date: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactProps> = ({ contact }) => {
  return (
    <div className="bg-white p-4 rounded shadow text-black inline-block m-2">
      <div className="mb-4 text-gray-500">
        <strong>Date:</strong> {contact.date}
      </div>
      <div className="mb-4 text-gray-600">
        <strong>Email:</strong> {contact.email}
      </div>
      <div className="mb-4 text-black">
        <strong>Subject:</strong> {contact.subject}
      </div>
      <div>
        <strong>Message:</strong> {contact.message}
      </div>
    </div>
  );
};

export default ContactCard;
