import React from 'react';
import { Link } from 'react-router-dom';

function RegistroSucessoPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 font-sans not-italic">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-4">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Cadastro Realizado com Sucesso!</h2>
        <p className="text-gray-600 mb-6">
          Seu cadastro foi enviado e está aguardando aprovação de um secretário da igreja.
        </p>
        <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-4 text-left">
          <h4 className="font-semibold">Próximos passos:</h4>
          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
            <li>Aguarde a aprovação do seu cadastro.</li>
            <li>Você será notificado quando for aprovado.</li>
            <li>Após a aprovação, poderá fazer login no sistema.</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 transition-colors">
            Voltar ao Início
          </Link>
          <Link to="/login" className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-md hover:bg-gray-300 transition-colors">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegistroSucessoPage;