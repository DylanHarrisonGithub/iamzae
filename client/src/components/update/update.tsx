// Update.tsx

import React from 'react';

interface UpdateProps {
  update: {
    subject: string,
    date: string,
    update: string
  }
}

const Update: React.FC<UpdateProps> = ({update: { subject }, update: { date }, update: { update } }) => {
  return (
    <div className="bg-gray-200 p-4 rounded-md shadow-md m-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
        <h2 className="text-lg font-bold mb-2 md:mb-0">{subject}</h2>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
      <p className="text-base">{update}</p>
    </div>
  );
};

export default Update;
