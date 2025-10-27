import React from 'react';

function NextArrow(props) {
  // A 'className' agora será usada novamente
  const { className, style, onClick } = props;
  return (
    <div
      // A MUDANÇA ESTÁ AQUI: Adicionamos a 'className' de volta
      className={className}
      style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClick}
    >
      <div className="bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/75 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      // A MUDANÇA ESTÁ AQUI: Adicionamos a 'className' de volta
      className={className}
      style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClick}
    >
      <div className="bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/75 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>
    </div>
  );
}

export { NextArrow, PrevArrow };