import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCliente, useUpdateCliente } from '../hooks';
import { ClienteForm } from '../components/clientes';
import { Loading } from '../components/common';
import { UpdateClienteDTO } from '../types/cliente.types';

const EditarCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: cliente, isLoading } = useCliente(id);
  const updateCliente = useUpdateCliente();

  const handleSubmit = async (data: UpdateClienteDTO) => {
    await updateCliente.mutateAsync(data);
    navigate(`/clientes/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Cliente não encontrado
        </h2>
        <button
          onClick={() => navigate('/clientes')}
          className="text-primary-600 hover:text-primary-700"
        >
          Voltar para lista de clientes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Cliente</h1>
        <p className="text-gray-600 mt-1">
          Atualize os dados do cliente {cliente.nome}
        </p>
      </div>

      <ClienteForm
        cliente={cliente}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/clientes/${id}`)}
        isSubmitting={updateCliente.isPending}
      />
    </div>
  );
};

export default EditarCliente;
