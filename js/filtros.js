// Módulo de filtragem e ordenação de personagens.
const Filtros = {
  normalizar(texto) {
    return String(texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  },

  aplicar(lista, { termo = '', classe = '', especie = '', status = '', relacao = '', ordem = 'nome-asc' } = {}) {
    const busca = this.normalizar(termo);
    const classeNorm = this.normalizar(classe);
    const especieNorm = this.normalizar(especie);

    const filtrados = lista.filter(p => {
      if (busca) {
        const camposTexto = [p.nome, p.descricao, p.antecedente]
          .map(c => this.normalizar(c))
          .join(' ');
        if (!camposTexto.includes(busca)) return false;
      }
      if (classeNorm && this.normalizar(p.classe) !== classeNorm) return false;
      if (especieNorm && this.normalizar(p.especie ?? p.raca) !== especieNorm) return false;
      if (status && p.status !== status) return false;
      if (relacao && p.relacao !== relacao) return false;
      return true;
    });

    return this.ordenar(filtrados, ordem);
  },

  ordenar(lista, ordem) {
    const copia = [...lista];
    if (ordem === 'nome-desc') {
      return copia.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
    }
    if (ordem === 'recentes') {
      return copia.reverse();
    }
    return copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  },

  temAtivo({ termo = '', classe = '', especie = '', status = '', relacao = '', ordem = 'nome-asc' } = {}) {
    return Boolean(termo.trim() || classe || especie || status || relacao || ordem !== 'nome-asc');
  }
};