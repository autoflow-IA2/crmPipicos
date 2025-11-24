import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button, Input } from '../common';
import { useBrinquedosByCategoria, useCreateAgendamento, useUpdateAgendamento } from '../../hooks';
import type { Brinquedo } from '../../types';
import { inventarioService } from '../../services';
import type { DisponibilidadeResponse } from '../../types/inventario.types';

interface BrinquedoSelecionado {
  brinquedo: Brinquedo;
  quantidade: number;
  disponibilidade?: DisponibilidadeResponse;
}

interface AgendamentoFormProps {
  initialData?: any;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  initialData,
  mode = 'create',
  onSuccess,
  onCancel,
}) => {
  const { data: brinquedosPorCategoria } = useBrinquedosByCategoria();
  const createAgendamento = useCreateAgendamento();
  const updateAgendamento = useUpdateAgendamento();

  // Dados do Cliente
  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteEndereco, setClienteEndereco] = useState('');
  const [clienteBairro, setClienteBairro] = useState('');
  const [clienteCidade, setClienteCidade] = useState('');
  const [clienteCep, setClienteCep] = useState('');

  // Dados do Evento
  const [tipoServico, setTipoServico] = useState<'brinquedos' | 'recreacao' | 'decoracao' | 'completo'>('brinquedos');
  const [dataEvento, setDataEvento] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [numConvidados, setNumConvidados] = useState('');
  const [faixaEtaria, setFaixaEtaria] = useState('');

  // Brinquedos
  const [brinquedosSelecionados, setBrinquedosSelecionados] = useState<BrinquedoSelecionado[]>([]);
  const [categoriaAtual, setCategoriaAtual] = useState('');
  const [brinquedoAtual, setBrinquedoAtual] = useState('');
  const [quantidadeAtual, setQuantidadeAtual] = useState(1);

  // Financeiro
  const [formaPagamento, setFormaPagamento] = useState('');
  const [valorSinal, setValorSinal] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Carregar dados iniciais (modo de edição ou dados do calendário)
  useEffect(() => {
    if (initialData) {
      // Dados do cliente (somente no modo edit)
      if (mode === 'edit') {
        setClienteNome(initialData.cliente_nome || '');
        setClienteTelefone(initialData.cliente_telefone || '');
        setClienteEmail(initialData.cliente_email || '');
        setClienteEndereco(initialData.cliente_endereco || '');
        setClienteBairro(initialData.cliente_bairro || '');
        setClienteCidade(initialData.cliente_cidade || '');
        setClienteCep(initialData.cliente_cep || '');

        setTipoServico(initialData.tipo_servico || 'brinquedos');
        setTipoEvento(initialData.tipo_evento || '');
        setNumConvidados(initialData.num_convidados?.toString() || '');
        setFaixaEtaria(initialData.faixa_etaria?.toString() || '');

        setFormaPagamento(initialData.forma_pagamento || '');
        setValorSinal(initialData.valor_sinal?.toString() || '');
        setObservacoes(initialData.observacoes || '');

        // Carregar brinquedos selecionados
        if (initialData.brinquedos_selecionados && initialData.brinquedos_selecionados.length > 0) {
          const brinquedosCarregados: BrinquedoSelecionado[] = initialData.brinquedos_selecionados.map((item: any) => ({
            brinquedo: {
              id: item.id,
              nome: item.nome,
              valor_locacao: item.valor,
              quantidade_estoque: 999,
            } as Brinquedo,
            quantidade: item.quantidade,
          }));
          setBrinquedosSelecionados(brinquedosCarregados);
        }
      }

      // Dados de data/hora (sempre, mesmo no modo create quando vem do calendário)
      setDataEvento(initialData.data_evento || '');
      setHoraInicio(initialData.hora_inicio || '');
      setHoraFim(initialData.hora_fim || '');
    }
  }, [mode, initialData]);

  // Cálculo automático de valores
  const valorTotal = brinquedosSelecionados.reduce((total, item) => {
    return total + (Number(item.brinquedo.valor_locacao) * item.quantidade);
  }, 0);

  const valorRestante = valorTotal - Number(valorSinal || 0);

  const adicionarBrinquedo = async () => {
    if (!brinquedoAtual) {
      toast.error('Selecione um brinquedo');
      setErros({ ...erros, brinquedo: 'Selecione um brinquedo' });
      return;
    }

    const brinquedoEncontrado = Object.values(brinquedosPorCategoria || {})
      .flat()
      .find(b => b.id === brinquedoAtual);

    if (!brinquedoEncontrado) return;

    // Verificar se já foi adicionado
    const jaAdicionado = brinquedosSelecionados.find(
      item => item.brinquedo.id === brinquedoAtual
    );

    if (jaAdicionado) {
      toast.error('Este brinquedo já foi adicionado');
      setErros({ ...erros, brinquedo: 'Este brinquedo já foi adicionado' });
      return;
    }

    // Verificar estoque total
    if (quantidadeAtual > brinquedoEncontrado.quantidade_estoque) {
      toast.error(`Estoque total: ${brinquedoEncontrado.quantidade_estoque}`);
      setErros({ ...erros, quantidade: `Estoque total: ${brinquedoEncontrado.quantidade_estoque}` });
      return;
    }

    // Verificar disponibilidade em tempo real (se data e hora estiverem preenchidos)
    let disponibilidade: DisponibilidadeResponse | undefined;
    if (dataEvento && horaInicio && horaFim) {
      try {
        disponibilidade = await inventarioService.verificarDisponibilidade({
          brinquedo_id: brinquedoEncontrado.id,
          data_evento: dataEvento,
          hora_inicio: horaInicio,
          hora_fim: horaFim,
          quantidade_desejada: quantidadeAtual,
          excludeAgendamentoId: mode === 'edit' && initialData?.id ? initialData.id : undefined,
        });

        if (!disponibilidade.disponivel) {
          toast.error(
            `Apenas ${disponibilidade.quantidade_disponivel} de ${disponibilidade.quantidade_total} disponíveis para esta data/horário`,
            { duration: 5000 }
          );
          setErros({
            ...erros,
            quantidade: `Disponível: ${disponibilidade.quantidade_disponivel} unidades`
          });
          return;
        }

        // Mostrar aviso se há pouco estoque disponível
        if (disponibilidade.quantidade_disponivel <= 2) {
          toast('⚠️ Atenção: Estoque limitado para esta data!', {
            icon: '⚠️',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        toast.error('Não foi possível verificar disponibilidade. Verifique data e horário.');
      }
    }

    setBrinquedosSelecionados([
      ...brinquedosSelecionados,
      {
        brinquedo: brinquedoEncontrado,
        quantidade: quantidadeAtual,
        disponibilidade,
      },
    ]);

    // Limpar campos
    setBrinquedoAtual('');
    setQuantidadeAtual(1);
    setCategoriaAtual('');
    setErros({});

    const mensagem = disponibilidade
      ? `${brinquedoEncontrado.nome} adicionado! (${disponibilidade.quantidade_disponivel - quantidadeAtual} restantes)`
      : `${brinquedoEncontrado.nome} adicionado!`;

    toast.success(mensagem);
  };

  const removerBrinquedo = (brinquedoId: string) => {
    setBrinquedosSelecionados(
      brinquedosSelecionados.filter(item => item.brinquedo.id !== brinquedoId)
    );
  };

  const validarEtapa1 = () => {
    const novosErros: Record<string, string> = {};

    if (!clienteNome.trim()) novosErros.clienteNome = 'Nome é obrigatório';
    if (!clienteTelefone.trim()) novosErros.clienteTelefone = 'Telefone é obrigatório';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa2 = () => {
    const novosErros: Record<string, string> = {};

    if (!dataEvento) novosErros.dataEvento = 'Data do evento é obrigatória';
    if (!horaInicio) novosErros.horaInicio = 'Hora de início é obrigatória';
    if (!horaFim) novosErros.horaFim = 'Hora de término é obrigatória';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarEtapa3 = () => {
    const novosErros: Record<string, string> = {};

    if (brinquedosSelecionados.length === 0) {
      novosErros.brinquedos = 'Selecione pelo menos um brinquedo';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const proximaEtapa = () => {
    if (etapaAtual === 1 && validarEtapa1()) {
      setEtapaAtual(2);
    } else if (etapaAtual === 2 && validarEtapa2()) {
      setEtapaAtual(3);
    } else if (etapaAtual === 3 && validarEtapa3()) {
      setEtapaAtual(4);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
      setErros({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = mode === 'edit';
    const loadingToast = toast.loading(
      isEditing ? 'Atualizando agendamento...' : 'Criando agendamento...'
    );

    try {
      const data: any = {
        // Dados do cliente
        cliente_nome: clienteNome,
        cliente_telefone: clienteTelefone,
        cliente_email: clienteEmail || undefined,
        cliente_endereco: clienteEndereco || undefined,
        cliente_bairro: clienteBairro || undefined,
        cliente_cidade: clienteCidade || undefined,
        cliente_cep: clienteCep || undefined,

        // Dados do evento
        tipo_servico: tipoServico,
        data_evento: dataEvento,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        tipo_evento: tipoEvento || undefined,
        num_convidados: numConvidados ? Number(numConvidados) : undefined,
        faixa_etaria: faixaEtaria || undefined,

        // Brinquedos
        brinquedos_selecionados: brinquedosSelecionados.map(item => ({
          id: item.brinquedo.id,
          nome: item.brinquedo.nome,
          quantidade: item.quantidade,
          valor: item.brinquedo.valor_locacao,
        })),

        // Financeiro
        valor_total: valorTotal,
        valor_sinal: Number(valorSinal) || 0,
        valor_restante: valorRestante,
        forma_pagamento: formaPagamento || undefined,
        status_pagamento: Number(valorSinal) > 0 ? 'sinal_pago' : 'pendente',

        // Status e observações
        status: isEditing ? initialData.status : 'pendente',
        observacoes: observacoes || undefined,
      };

      if (isEditing) {
        await updateAgendamento.mutateAsync({
          id: initialData.id,
          data,
        });
        toast.success('Agendamento atualizado com sucesso!', { id: loadingToast });
      } else {
        await createAgendamento.mutateAsync(data);
        toast.success('Agendamento criado com sucesso!', { id: loadingToast });
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast.error(
        isEditing
          ? 'Erro ao atualizar agendamento. Tente novamente.'
          : 'Erro ao criar agendamento. Tente novamente.',
        { id: loadingToast }
      );
      setErros({ submit: 'Erro ao salvar agendamento. Tente novamente.' });
    }
  };

  const brinquedosCategoria = categoriaAtual && brinquedosPorCategoria
    ? brinquedosPorCategoria[categoriaAtual] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Indicador de Etapas */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((etapa) => (
          <div key={etapa} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                etapa <= etapaAtual
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {etapa}
            </div>
            {etapa < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  etapa < etapaAtual ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Etapa 1: Dados do Cliente */}
      {etapaAtual === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black mb-6">Dados do Cliente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Nome Completo *
              </label>
              <Input
                type="text"
                value={clienteNome}
                onChange={(e) => setClienteNome(e.target.value)}
                placeholder="Nome do cliente"
                error={erros.clienteNome}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Telefone *
              </label>
              <Input
                type="tel"
                value={clienteTelefone}
                onChange={(e) => setClienteTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                error={erros.clienteTelefone}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Email
              </label>
              <Input
                type="email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                CEP
              </label>
              <Input
                type="text"
                value={clienteCep}
                onChange={(e) => setClienteCep(e.target.value)}
                placeholder="00000-000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">
                Endereço
              </label>
              <Input
                type="text"
                value={clienteEndereco}
                onChange={(e) => setClienteEndereco(e.target.value)}
                placeholder="Rua, número"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Bairro
              </label>
              <Input
                type="text"
                value={clienteBairro}
                onChange={(e) => setClienteBairro(e.target.value)}
                placeholder="Bairro"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Cidade
              </label>
              <Input
                type="text"
                value={clienteCidade}
                onChange={(e) => setClienteCidade(e.target.value)}
                placeholder="Cidade"
              />
            </div>
          </div>
        </div>
      )}

      {/* Etapa 2: Dados do Evento */}
      {etapaAtual === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black mb-6">Dados do Evento</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Tipo de Serviço *
              </label>
              <select
                value={tipoServico}
                onChange={(e) => setTipoServico(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="brinquedos">Brinquedos</option>
                <option value="recreacao">Recreação</option>
                <option value="decoracao">Decoração</option>
                <option value="completo">Completo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Tipo de Evento
              </label>
              <Input
                type="text"
                value={tipoEvento}
                onChange={(e) => setTipoEvento(e.target.value)}
                placeholder="Ex: Aniversário, Casamento"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Data do Evento *
              </label>
              <Input
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
                error={erros.dataEvento}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Número de Convidados
              </label>
              <Input
                type="number"
                value={numConvidados}
                onChange={(e) => setNumConvidados(e.target.value)}
                placeholder="Quantidade"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Hora de Início *
              </label>
              <Input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                error={erros.horaInicio}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Hora de Término *
              </label>
              <Input
                type="time"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                error={erros.horaFim}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Faixa Etária
              </label>
              <select
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione</option>
                <option value="infantil">Infantil (0-12 anos)</option>
                <option value="adolescente">Adolescente (13-17 anos)</option>
                <option value="adulto">Adulto (18+ anos)</option>
                <option value="misto">Misto</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Etapa 3: Seleção de Brinquedos */}
      {etapaAtual === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black mb-6">Seleção de Brinquedos</h2>

          {erros.brinquedos && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {erros.brinquedos}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Categoria
                </label>
                <select
                  value={categoriaAtual}
                  onChange={(e) => {
                    setCategoriaAtual(e.target.value);
                    setBrinquedoAtual('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {Object.keys(brinquedosPorCategoria || {}).map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Brinquedo
                </label>
                <select
                  value={brinquedoAtual}
                  onChange={(e) => setBrinquedoAtual(e.target.value)}
                  disabled={!categoriaAtual}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                >
                  <option value="">Selecione um brinquedo</option>
                  {brinquedosCategoria.map((brinquedo) => (
                    <option key={brinquedo.id} value={brinquedo.id}>
                      {brinquedo.nome} - R$ {brinquedo.valor_locacao?.toFixed(2)} ({brinquedo.quantidade_estoque} disp.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantidadeAtual}
                  onChange={(e) => setQuantidadeAtual(Number(e.target.value))}
                  error={erros.quantidade}
                />
              </div>

              <div>
                <Button
                  type="button"
                  onClick={adicionarBrinquedo}
                  variant="secondary"
                  disabled={!brinquedoAtual}
                >
                  Adicionar
                </Button>
              </div>
            </div>
            {erros.brinquedo && (
              <p className="text-red-600 text-sm mt-2">{erros.brinquedo}</p>
            )}
          </div>

          {/* Lista de Brinquedos Selecionados */}
          {brinquedosSelecionados.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Brinquedos Selecionados</h3>
              <div className="space-y-2">
                {brinquedosSelecionados.map((item) => (
                  <div
                    key={item.brinquedo.id}
                    className="flex items-center justify-between bg-white p-4 rounded-lg border"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.brinquedo.nome}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantidade}x - R$ {item.brinquedo.valor_locacao?.toFixed(2)} = R${' '}
                        {(item.quantidade * Number(item.brinquedo.valor_locacao)).toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removerBrinquedo(item.brinquedo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Valor Total:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    R$ {valorTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Etapa 4: Pagamento e Finalização */}
      {etapaAtual === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black mb-6">Pagamento e Finalização</h2>

          <div className="bg-primary-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-black">R$ {valorTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor do Sinal</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {(Number(valorSinal) || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Restante</p>
                <p className="text-2xl font-bold text-orange-600">R$ {valorRestante.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Forma de Pagamento
              </label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Valor do Sinal (R$)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max={valorTotal}
                value={valorSinal}
                onChange={(e) => setValorSinal(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-black mb-1">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Informações adicionais sobre o agendamento..."
              />
            </div>
          </div>

          {erros.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {erros.submit}
            </div>
          )}
        </div>
      )}

      {/* Botões de Navegação */}
      <div className="flex justify-between pt-6 border-t">
        <div>
          {etapaAtual > 1 && (
            <Button type="button" onClick={etapaAnterior} variant="secondary">
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancelar
            </Button>
          )}

          {etapaAtual < 4 ? (
            <Button type="button" onClick={proximaEtapa} variant="primary">
              Próxima
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={createAgendamento.isPending}
            >
              {createAgendamento.isPending ? 'Criando...' : 'Criar Agendamento'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AgendamentoForm;
