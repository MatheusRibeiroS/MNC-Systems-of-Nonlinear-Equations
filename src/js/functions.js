/**
 * Function to create popup for the information button.
 */
const infoButton = (input) => {
  const body = document.querySelector("body");
  const elem = document.createElement("details");
  body.appendChild(elem);
  elem.outerHTML = `
    <div id="modal-info" open>
      <div class="details-modal-overlay"></div>
      <div class='details-modal'>
        <div class='details-modal-close' onclick='document.querySelector("#modal-info").remove()' style="cursor: pointer">
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z'
              fill='black'
            />
          </svg>
        </div>
        <div class='details-modal-title'>
          <h1>Criado por:</h1>
        </div>
        <div class='details-modal-content'>
          <p>
            Matheus Ribeiro e Cassiano Rodrigues
          </p>
        </div>
      </div>
    </div>
    `;
};

/**
 * returns the mathematical expression formatted using Regex.
 *
 * @param {input} string of the unformatted mathematical expression.
 * @return {output} string of the formatted mathematical expression.
 */
function formattingExpression(input) {
  return input
    .toLowerCase()
    .replace(/sen|sin/gi, "Math.sin")
    .replace(/cos/gi, "Math.cos")
    .replace(/tg|tan/gi, "Math.tan")
    .replace(/sinh/gi, "Math.sinh")
    .replace(/cosh/gi, "Math.cosh")
    .replace(/tanh/gi, "Math.tanh")
    .replace(/\^/gi, "**")
    .replace(/pi/gi, "Math.PI")
    .replace(/\log\D/gi, "Math.log10(")
    .replace(/\ln/gi, "Math.log")
    .replace(/\e/gi, "Math.E");
}

/**
 * Function that create function evaluators.
 */
function createMathFunction(...args) {
  const func = args.shift();
  return new Function(...args, `return ${func};`);
}

/**
 * Function to clear all point inputs of the points table.
 */
const clearInputs = () => {
  [...document.querySelectorAll(".input-menu input")].map(
    (el) => (el.value = "")
  );
};

/**
 * Function to select all Toggle from curved lists.
 */
const selectAll = () =>
  [...document.querySelectorAll(".toggles li .toggle-control input")].map(
    (el) => !el.disabled && (el.checked = !el.checked)
  );

/**
 * Function that generates graphs.
 * @param { info } object of the chart data.
 */
const genChart = ({ func, func_original, a, b }) => {
  if (func || a || b) {
    const chartDiv = document.querySelector("#chart-div");
    const containerDiv = document.querySelector("#container-chart");
    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = "chart";
    chartDiv.innerHTML = "";
    chartDiv.appendChild(chartCanvas);
    containerDiv.style.display = "block";

    const labels = [].range(a, b, 0.25);
    const f = createMathFunction(func, "x");
    const data_result = labels.map((x) => f(x));

    const data = {
      labels: labels,
      datasets: [
        {
          type: "line",
          label: `F(x) = ${func_original}`,
          borderColor: "#222229",
          backgroundColor: "#222229",
          cubicInterpolationMode: "monotone",
          borderWidth: 2,
          radius: 0,
          data: data_result,
        },
        {
          type: "line",
          label: "Area",
          backgroundColor: "rgba(33,150,243,0.4)",
          cubicInterpolationMode: "monotone",
          fill: true,
          borderWidth: 1,
          radius: 0,
          data: data_result,
        },
      ],
    };

    const config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        legend: {
          position: "top",
        },
        plugins: {
          title: {
            display: true,
            text: "Gráfico da Função",
          },
          tooltip: {
            enabled: true,
            filter: function (tooltipItem) {
              var dSet = tooltipItem.datasetIndex;
              if (dSet == 1) {
                return false;
              } else {
                return true;
              }
            },
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        scale: {
          ticks: {
            beginAtZero: true,
          },
        },
      },
    };

    new Chart(chartCanvas, config);
    return;
  }
  alert("Entradas inválidas");
};

/**
 * Function that captures user input data.
 * @return { object } Object with input data.
 */
const getInput = () => ({
  func: formattingExpression(document.querySelector("#function").value),
  func_original: document.querySelector("#function").value,
  a: Number(document.querySelector("#a").value),
  b: Number(document.querySelector("#b").value),
  epsilon: Number(document.querySelector("#epsilon").value),
});

/**
 * Função encaminha a chamada dos métodos conforme a seleção do Usuário.
 * @returns { Object } Object with the results of the integrals obtained by the methods.
 */
const whichSelected = () => {
  const result = {};
  const onlySelects = [...document.querySelectorAll(".toggle-control input")]
    .map((el) => el.checked && Number(el.value))
    .filter(Boolean);

  onlySelects.length != 0 &&
    onlySelects.forEach((el) => {
      switch (el) {
        case 1:
          // Retângulos à esquerda
          // ------------------------
          result.leftRectangles = {
            methodName: "Retângulos à esquerda",
            value: leftRectangleRuleMethod(getInput()),
          };
          break;

        case 2:
          // Retângulos à direita
          // ------------------------
          result.rightRectangles = {
            methodName: "Retângulos à direita",
            value: rightRectangleRuleMethod(getInput()),
          };
          break;

        case 3:
          // Regra dos Trapézios
          // ------------------------
          result.trapezoids = {
            methodName: "Regra dos Trapézios",
            value: trapezoidolRuleMethod(getInput()),
          };
          break;

        case 4:
          // Regra 1/3 de Simpson
          // ------------------------
          result.simpson13 = {
            methodName: "Regra 1/3 de Simpson",
            value: simpson13RuleMethod(getInput()),
          };
          break;

        case 5:
          // Regra 3/8 de Simpson
          // ------------------------
          result.simpson38 = {
            methodName: "Regra 3/8 de Simpson",
            value: simpson38RuleMethod(getInput()),
          };
          break;

        case 6:
          // Quadratura de Gauss
          // ------------------------
          result.quadrature = {
            methodName: "Quadratura de Gauss",
            value: GaussQuadratureMethod(getInput()),
          };
          break;
      }
    });
  return result;
};

/**
 * Função que possibilita a visualizaçào na aplicação.
 * @param { Object } Object with the results of the integrals obtained by the methods.
 */
const showResult = (objectResult) => {
  const resultDiv = document.querySelector("#result-div");
  resultDiv.innerHTML = "";
  let content = "";

  /*
   * Creates table contents, from the results object.
   */
  Object.entries(objectResult).forEach(([key, value]) => {
    content += `<tr>
            <td>${value.methodName}</td>
            <td>${
              typeof value.value != "string"
                ? value.value.toFixed(9)
                : value.value
            }</td>
          </tr>`;
  });

  const resultTable = document.createElement("table");
  resultTable.className = "result-table";
  resultTable.innerHTML = `
    <thead>
      <tr>
        <th>Método</th>
        <th>Resultado</th>
      </tr>
    </thead>
    <tbody>
      ${content}
    </tbody>
  `;
  resultDiv.appendChild(resultTable);
  resultDiv.style.display = "block";
};

const resize = (n) => {
  if (n && n >= 2 && !isNaN(n)) {
    const divTable = document.querySelector(".config-table");
    const table = document.querySelector("#input-table");
    table.innerHTML = "";
    divTable.style.display = "unset";

    let row = new Array(n);
    let cells = new Array(3);

    ArrayFrom(n + 1).forEach((i) => {
      row[i] = document.createElement("tr");
    });
    ArrayFrom(3).forEach((i) => {
      cells[i] = document.createElement("td");
    });

    // Labels
    labels = ["i", "Equações f(x)", "Y"];
    labels.forEach((el) => {
      cell = document.createElement("td");
      cell.innerHTML = el;
      row[0].appendChild(cell);
    });

    // Inputs
    ArrayFrom(n).forEach((i) => {
      // fazer o espaço para as (n) estimativas

      ArrayFrom(3).forEach((j) => {
        cell = document.createElement("td");

        if (j == 0) cell.innerHTML = `<span>${i}</span>`;
        if (j == 1)
          cell.innerHTML = `<input type="text" id="input-${i}-${j}" value="x^2 + ${i}" />`;
        if (j == 2)
          cell.innerHTML = `<input type="text" id="input-${i}-${j}" value="${i}" />`;
        row[i + 1].appendChild(cell);
      });
    });
    row.forEach((el) => {
      table.appendChild(el);
    });

    return;
  }
  alert("Inputs inválidos");
  return;
};

const fillInputs = (target, content) => {
  const inputs = document.querySelectorAll(target);
  inputs.forEach((el) => {
    el.value = content;
  });
};

const ArrayFrom = (...args) =>
  args.length == 1
    ? Array.from({ length: args[0] }, (_, k) => k)
    : Array.from({ length: args[1] - args[0] + 1 }, (_, k) => k + args[0]);
