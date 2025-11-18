import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCliente } from '../hooks';
import { ClienteForm } from '../components/clientes';
import { CreateClienteDTO } from '../types/cliente.types';

const NovoCliente: React.FC = () => {
  const navigate = useNavigate();
  const createCliente = useCreateCliente();

  const handleSubmit = async (data: CreateClienteDTO) => {
    await createCliente.mutateAsync(data);
    navigate('/clientes');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Novo Cliente</h1>
        <p className="text-black font-bold mt-1">
          Preencha os dados para cadastrar um novo cliente
        </p>
      </div>

      <ClienteForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/clientes')}
        isSubmitting={createCliente.isPending}
      />
    </div>
  );
};

export default NovoCliente;
