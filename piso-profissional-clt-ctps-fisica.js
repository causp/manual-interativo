// piso-profissional.js

$(document).ready(function() {
    // Aplica a máscara ao campo de carga horária
    $('#entrada_carga_horaria_clt_ctps_fisica').mask('00:00');
});

const salariosMinimos_clt_ctps_fisica = [
    { data: "2022-01-01", valor: 1212.00 },
    { data: "2021-01-01", valor: 1100.00 },
    { data: "2020-02-01", valor: 1045.00 },
    { data: "2020-01-01", valor: 1039.00 },
    { data: "2019-01-01", valor: 998.00 },
    { data: "2018-01-01", valor: 954.00 },
    { data: "2017-01-01", valor: 937.00 },
    { data: "2016-01-01", valor: 880.00 },
    { data: "2015-01-01", valor: 788.00 },
    { data: "2014-01-01", valor: 724.00 },
    { data: "2013-01-01", valor: 678.00 },
    { data: "2012-01-01", valor: 622.00 }
];

let tipoCalculo_clt_ctps_fisica = 'diario_clt_ctps_fisica'; // Tipo de cálculo padrão (diário)

function atualizarSalarioMinimoCltCtpsFisica() {
    let dataContrato = document.getElementById('dataInicio_clt_ctps_fisica').value;
    let avisoSalario = document.getElementById('avisoSalario_clt_ctps_fisica');
    avisoSalario.innerHTML = ""; // Limpa mensagem anterior

    if (!dataContrato) return;

    let salario = salariosMinimos_clt_ctps_fisica.find(salario => dataContrato >= salario.data);
    
    if (!salario) {
        avisoSalario.innerHTML = "Nenhum salário mínimo encontrado para a data selecionada.";
        document.getElementById('entrada_salario_minimo_clt_ctps_fisica').value = "Data inválida para cálculo.";
    } else {
        document.getElementById('entrada_salario_minimo_clt_ctps_fisica').value = `R$ ${salario.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    // Exibe aviso se a data for a partir de 3 de março de 2022
    if (dataContrato >= "2022-03-03") {
        avisoSalario.innerHTML = "Conforme a deliberação nº 99/2024 - CEP - CAU/SP, para vínculos com vigência a partir de 3 de março de 2022, o salário mínimo a ser considerado para a base de cálculo é de R$ 1.212,00 (valor congelado conforme decisão do Supremo Tribunal Federal no julgamento conjunto das ADPFs 53, 149 e 171).";
    }
}

function atualizarTipoCalculoCltCtpsFisica() {
    tipoCalculo_clt_ctps_fisica = document.getElementById('tipo_calculo_clt_ctps_fisica').value;
    
    // Atualiza o label conforme o tipo de cálculo selecionado
    let labelCargaHoraria = document.getElementById('labelCargaHoraria_clt_ctps_fisica');
    if (tipoCalculo_clt_ctps_fisica === 'diario_clt_ctps_fisica') {
        labelCargaHoraria.textContent = "Carga Horária (Horas por Dia):";
    } else {
        labelCargaHoraria.textContent = "Carga Horária (Horas por Semana):";
    }
}

function limparCamposCltCtpsFisica() {
    document.getElementById('dataInicio_clt_ctps_fisica').value = '';
    document.getElementById('entrada_salario_minimo_clt_ctps_fisica').value = '';
    document.getElementById('entrada_carga_horaria_clt_ctps_fisica').value = '';
    document.getElementById('resultado_clt_ctps_fisica').innerHTML = '';
    document.getElementById('erroCargaHoraria_clt_ctps_fisica').innerHTML = '';
    document.getElementById('avisoSalario_clt_ctps_fisica').innerHTML = '';
    document.getElementById('resultado_clt_ctps_fisica').style.display = 'none';  // Esconde o resultado
}

function calcularPisoCltCtpsFisica() {
    var salarioMinimo = obterSalarioMinimoCltCtpsFisica(); // Função que pega o salário com base na data escolhida
    var cargaHorariaEmHoras = document.getElementById('entrada_carga_horaria_clt_ctps_fisica').value;
    
    // Validação da carga horária no formato "hh:mm"
    var partesCargaHoraria = cargaHorariaEmHoras.split(':');
    var horas = parseInt(partesCargaHoraria[0]);
    var minutos = parseInt(partesCargaHoraria[1]);

    // Verifica se os minutos são válidos (0-59) e se horas não são inválidas
    if (isNaN(horas) || isNaN(minutos) || minutos > 59) {
        alert("Por favor, insira uma carga horária válida no formato hh:mm (Exemplo: 08:30)");
        return;
    }

    var cargaHoraria = horas + minutos / 60; // Converte para horas

    if (isNaN(salarioMinimo) || isNaN(cargaHoraria)) {
        alert("Por favor, insira valores numéricos válidos.");
        return;
    }

    var resultadoDiv = document.getElementById('resultado_clt_ctps_fisica');

    // Torna o resultado visível
    resultadoDiv.style.display = 'block';  // Torna o div visível

    let qtdSalariosAReceber;

    if (tipoCalculo_clt_ctps_fisica === 'diario_clt_ctps_fisica') {
        // Calculando o salário com base na carga horária diária
        qtdSalariosAReceber = cargaHoraria > 6 ? 6 + ((cargaHoraria - 6) * 1.25) : cargaHoraria;
    } else if (tipoCalculo_clt_ctps_fisica === 'semanal_clt_ctps_fisica') {
        // Calculando o salário com base na carga horária semanal conforme a fórmula fornecida
        if (cargaHoraria <= 30) {
            qtdSalariosAReceber = cargaHoraria * 0.2;
        } else {
            qtdSalariosAReceber = 6 + ((cargaHoraria - 30) * 0.2) * 1.25;
        }
    }

    // Valor do salário a receber
    var valorSalarioMensalAReceber = qtdSalariosAReceber * salarioMinimo;

    // Função para formatar valores em reais (R$ 1.212,00)
    function formatarValor(valor) {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Exibição dos resultados organizados em uma tabela
    resultadoDiv.className = 'bd-callout bd-callout-info';
    resultadoDiv.innerHTML = `
        
        <table class="table table-bordered my-3">
            <thead class="table-light">
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Salário mínimo nacional informado</td>
                    <td>R$ ${formatarValor(salarioMinimo)}</td>
                </tr>
                <tr>
                    <td>Carga horária informada</td>
                    <td>${cargaHorariaEmHoras} horas</td>
                </tr>
                <tr>
                    <td>Quantidade de salários mínimos a receber</td>
                    <td>${formatarValor(qtdSalariosAReceber)}</td>
                </tr>
                <tr>
                    <td>Valor do salário mínimo profissional mensal</td>
                    <td>R$ ${formatarValor(valorSalarioMensalAReceber)}</td>
                </tr>
            </tbody>
        </table>

        <h6>Para os valores informados, a remuneração mensal MÍNIMA deverá ser de 
            <span class="bg-success text-white py-1 px-2 rounded">R$ ${formatarValor(valorSalarioMensalAReceber)}</span>
        </h6>
    `;
}

function obterSalarioMinimoCltCtpsFisica() {
    let dataContrato = document.getElementById('dataInicio_clt_ctps_fisica').value;
    let salario = salariosMinimos_clt_ctps_fisica.find(salario => dataContrato >= salario.data);
    return salario ? salario.valor : null;
}
