import React, { useState } from 'react';

interface Props {
  children: React.ReactNode,
  title: string,
  color1?: string,
  color2?: string,
}

const ToggleableContainer: React.FC<Props> = ({ children, title, color1, color2 }) => {

  return (
    <div className="collapse collapse-arrow card card-bordered border-white ml-1 mr-1 hover:m-0">
      <input type="checkbox" className="peer" /> 
      <div className={`collapse-title bg-${color1 || 'primary'} text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content text-2xl font-bold tracking-tight`}>
        { title }
      </div>
      <div className={`collapse-content bg-${color2 || 'primary'} text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content`}> 
        {children}
      </div>
    </div>
  );
};

export default ToggleableContainer;
