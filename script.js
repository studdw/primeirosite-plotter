let cardConteiner = document.querySelector(".card-container");
let dados = [];


// Carrega os dados dos jogos assim que a página é carregada
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json(); // Apenas carrega os dados, não os exibe
        
        popularFiltros(dados); // Popula os menus de filtro com os dados carregados
        renderizarCards(dados); // Exibe todos os cards ao carregar a página
    } catch (error) {
        console.error("Erro ao carregar os dados dos jogos:", error);
    }

    // Adiciona o "ouvinte" para o clique no botão de busca
    const botaoBusca = document.getElementById("botao-busca");
    botaoBusca.addEventListener("click", (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        iniciarBusca();
    });

    // Adiciona o "ouvinte" para o clique no botão de aplicar filtros
    const botaoFiltro = document.getElementById("apply-filters");
    botaoFiltro.addEventListener("click", (event) => {
        event.preventDefault();
        aplicarFiltros();
    });

});

function iniciarBusca() {
    const campoBusca = document.querySelector(".search-container input");
    const termoBusca = campoBusca.value.toLowerCase();

    const resultados = dados.filter(jogo => 
        jogo.nome.toLowerCase().includes(termoBusca) || 
        jogo.funcionalidade.toLowerCase().includes(termoBusca)
    );
    renderizarCards(resultados);
}

function popularFiltros(dados) {
    const filtroLancamento = document.getElementById('filter-lancamento');
    const filtroModelo = document.getElementById('filter-modelo');
    const filtroCabeca = document.getElementById('filter-cabeca');

    // Extrai valores únicos e ordenados
    const anos = [...new Set(dados.map(item => item.data_lancamento))].sort((a, b) => b - a);
    const marcas = [...new Set(dados.map(item => item.nome.split(' ')[0]))].sort();
    const cabecas = [...new Set(dados.map(item => item.cabeca_impressao))].sort();

    // Popula filtro de Data de Lançamento
    anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        filtroLancamento.appendChild(option);
    });

    // Popula filtro de Modelo (Marca)
    marcas.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        filtroModelo.appendChild(option);
    });

    // Popula filtro de Cabeça de Impressão
    cabecas.forEach(cabeca => {
        const option = document.createElement('option');
        option.value = cabeca;
        option.textContent = cabeca;
        filtroCabeca.appendChild(option);
    });
}

function aplicarFiltros() {
    const valorLancamento = document.getElementById('filter-lancamento').value;
    const valorModelo = document.getElementById('filter-modelo').value;
    const valorCabeca = document.getElementById('filter-cabeca').value;
    const valorCartucho = document.getElementById('filter-cartucho').value.toLowerCase();

    let resultadosFiltrados = dados.filter(item => {
        const matchLancamento = !valorLancamento || item.data_lancamento === valorLancamento;
        const matchModelo = !valorModelo || item.nome.startsWith(valorModelo);
        const matchCabeca = !valorCabeca || item.cabeca_impressao === valorCabeca;
        
        // Verifica se algum dos cartuchos compatíveis inclui o texto digitado
        const matchCartucho = !valorCartucho || item.cartuchos_compativeis.some(cartucho => 
            cartucho.toLowerCase().includes(valorCartucho)
        );

        return matchLancamento && matchModelo && matchCabeca && matchCartucho;
    });

    renderizarCards(resultadosFiltrados);
}

function renderizarCards(dados) {
    cardConteiner.innerHTML = ""; // Limpa o container antes de renderizar
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome} (${dado.data_lancamento})</h2>
        <p>${dado.funcionalidade}</p>
        <p><strong>Cartuchos:</strong> ${dado.cartuchos_compativeis.join(', ')}</p>
        <p><strong>Cabeça de Impressão:</strong> ${dado.cabeca_impressao}</p>
        <a href="${dado.link}" target="_blank">Saiba Mais</a>
        `
        cardConteiner.appendChild(article);
    
    }
}