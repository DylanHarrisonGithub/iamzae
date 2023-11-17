import React, { useState } from 'react';

import { UpdateType } from '../../models/models';
// type Update = {
//   subject: string,
//   date: string,
//   update: string
// };

interface UpdateFormProps {
  resolve: (update: UpdateType | null) => any
  updateInit?: UpdateType
}

const UpdateForm: React.FC<UpdateFormProps> = ({ resolve, updateInit }) => {
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState((() => { let d = new Date(); return `${d.getMonth().toString().padStart(2,'0')}/${d.getDay().toString().padStart(2,'0')}/${d.getFullYear()}`})());
  const [update, setUpdate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolve({subject: subject, date: date, update: update, id: -1 });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm md:max-w-md lg:max-w-lg rounded-md">
      <div className="mb-4">
        <label htmlFor="subject" className="block text-sm font-medium">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="update" className="block text-sm font-medium">
          Update
        </label>
        <textarea
          id="update"
          name="update"
          value={update}
          onChange={(e) => setUpdate(e.target.value)}
          rows={4}
          className="mt-1 p-2 w-full border rounded-md resize-none"
          required
        />
      </div>
      <div className='text-right'>
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 inline-block "
        >
          Submit
        </button>
      </div>

    </form>
  );
};

export default UpdateForm;
