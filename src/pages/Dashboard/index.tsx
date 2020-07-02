import React, { useEffect, useState, FormEvent } from 'react';
import { api, meg } from '../../service/api';

import { useToast } from '../../hooks/toast';

import { Title, Form, Repositories, Error } from './styles';

interface QueryCNPJ {
  cnpj: string;
  nome: string;
  fantasia: string;
  municipio: string;
  bairro: string;
  uf: string;
  cep: string;
  logradouro: string;
  abertura: string;
  situacao: string;
  natureza_juridica: string;
}

interface QueryCNPJMeg {
  cgc_9: number;
  cgc_4: number;
  cgc_2: number;
  nome_cliente: string;
  fantasia_cliente: string;
  cep_cliente: number;
  endereco_cliente: string;
  bairro: string;
  data_cad_cliente: string;
}

const Dashboard: React.FC = () => {
  const [newSearch, setNewSearch] = useState('');
  const [inputError, setInputError] = useState('');
  const [searchEmpresas, setSearchEmpresas] = useState<QueryCNPJ | null>(null);
  const [searchMeg, setSearchMeg] = useState<QueryCNPJMeg | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem(
      '@SearchReceitaWS:respositories',
      JSON.stringify(searchEmpresas),
    );
    localStorage.setItem('@SearchMeg:respositories', JSON.stringify(searchMeg));
  });

  async function handleNewSearch(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newSearch) {
      setInputError('Informe o CNPJ da empresa');
      return;
    }
    try {
      const response = await api.get<QueryCNPJ>(`${newSearch}`);
      const responseMeg = await meg.get<QueryCNPJMeg>(`${newSearch}`);
      const searchEmpresa = response.data;
      const searchMegi = responseMeg.data;

      setSearchEmpresas(searchEmpresa);
      setSearchMeg(searchMegi);

      if (searchEmpresa.nome === searchMegi.nome_cliente) {
        // addToast({
        //   type: 'success',
        //   title: 'Nomes iguais!',
        //   description: 'As descrições de nomes são iguais!',
        // });
        console.log(
          `Nomes iguais: ${searchEmpresa.nome} - ${searchMegi.nome_cliente}`,
        );
      } else {
        // addToast({
        //   type: 'error',
        //   title: 'Nomes diferentes!',
        //   description: 'As descrições de nomes são diferentes!',
        // });
        console.log(
          `Nomes diferentes: ${searchEmpresa.nome} - ${searchMegi.nome_cliente}`,
        );
      }

      setNewSearch('');
      setInputError('');
    } catch (err) {
      console.log(err);
      setInputError('Erro ao consultar este CNPJ');
    }
  }

  return (
    <>
      <Title>Pesquisa Receita - CNPJ</Title>

      <Form hasError={!!inputError} onSubmit={handleNewSearch}>
        <input
          value={newSearch}
          onChange={e => setNewSearch(e.target.value)}
          placeholder="Digite o número do CNPJ"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      {searchEmpresas && (
        <Repositories>
          <div key={searchEmpresas.cnpj}>
            <span>
              <strong>CNPJ: {searchEmpresas.cnpj}</strong>
            </span>
            <span>
              <strong>Razão Social: {searchEmpresas.nome}</strong>
            </span>
            <span>
              <strong>Nome Fantasia:</strong>
              <p>{searchEmpresas.fantasia}</p>
            </span>
            <span>
              <strong>Cidade:</strong>
              <p>{searchEmpresas.municipio}</p>
            </span>
            <span>
              <strong>Endereço:</strong>
              <p>{searchEmpresas.logradouro}</p>
            </span>
            <span>
              <strong>Bairro:</strong>
              <p>{searchEmpresas.bairro}</p>
            </span>
            <span>
              <strong>UF:</strong>
              <p>{searchEmpresas.uf}</p>
            </span>
            <span>
              <strong>CEP:</strong>
              <p>{searchEmpresas.cep}</p>
            </span>
            <span>
              <strong>Data Cadastro:</strong>
              <p>{searchEmpresas.abertura}</p>
            </span>
            <span>
              <strong>Situação:</strong>
              <p>{searchEmpresas.situacao}</p>
            </span>
            <span>
              <strong>Natureza Jurídica:</strong>
              <p>{searchEmpresas.natureza_juridica}</p>
            </span>
          </div>
        </Repositories>
      )}
    </>
  );
};

export default Dashboard;
