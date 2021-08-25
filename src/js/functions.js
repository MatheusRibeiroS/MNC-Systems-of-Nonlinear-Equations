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
const clearInputs = (context = ".input-menu input") => {
  [...document.querySelectorAll(context)].forEach((el) => (el.value = ""));
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
  n: parseInt(document.querySelector("#n").value),
  func: [...document.querySelectorAll("tbody tr td:nth-child(2) input")].map(
    (el) => formattingExpression(el.value)
  ),
  func_original: [
    ...document.querySelectorAll("tbody tr td:nth-child(2) input"),
  ].map((el) => el.value),
  y: [...document.querySelectorAll("tbody tr td:nth-child(3) input")].map(
    (el) => Number(el.value)),
  estimate: [
    ...document.querySelectorAll("#input-table td:nth-child(4) input"),
  ].map((el) => Number(el.value)),
  epsilon: Number(document.querySelector("#epsilon").value),
  a: parseInt(document.querySelector("#a").value),
  b: parseInt(document.querySelector("#b").value),
});

/**
 * Which enables visualization in the application.
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
            <td>${typeof value.value != "string"
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

/**
 * Function for creation of the entries table
 * @param { Number } n - Quantity of equations
 */
const resize = (n) => {
  if (n && n >= 2 && !isNaN(n) && n <= 10) {
    AllowDiv(".config-table");
    const table = document.querySelector("#input-table");
    table.innerHTML = "";

    const row = new Array(n + 1),
      labels = ["i", "Equações f(x)", "Y", "X Estimado"],
      input_type = [
        `<span>%INDEX1%</span>`,
        `<input type="text" id="input_FUNCTION-%INDEX1%-%INDEX2%" value="x^2 + %INDEX1%"/>`,
        `<input type="text" id="input_Y-%INDEX1%-%INDEX2%" value="%INDEX1%"/>`,
        `<input type="number" id="input_X-%INDEX1%-%INDEX2%" value="%INDEX1%"/>`,
      ];

    ArrayFrom(n + 1).forEach((i) => {
      row[i] = document.createElement("tr");
    });

    labels.forEach((el) => {
      cell = document.createElement("td");
      cell.innerHTML = el;
      row[0].appendChild(cell);
    });

    row.forEach((_, i) => {
      ArrayFrom(labels.length).forEach((j) => {
        cell = document.createElement("td");
        cell.innerHTML = input_type[j]
          .replace(/%index1%/gi, i - 1)
          .replace(/%index2%/gi, j - 1);
        if (i != 0) row[i].appendChild(cell);
      });
      table.appendChild(row[i]);
    });
    return;
  }
  alert("inputs inválidos, insira um valor entre 2 e 10");
  return;
};

/**
 * Função para preencher com inputs com o conteúdo.
 * @param { String } target - Which should be filled.
 * @param { Number } content - Content to be filled.
 */
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

const getData = () => {
  const functions = [
    ...document.querySelectorAll("#input-table td:nth-child(2) input"),
  ].map((el) => el.value);

  return {
    functions,
    a: document.querySelector("#a").value,
    b: document.querySelector("#b").value,
  };
};

const AllowDiv = (target) => {
  const div = document.querySelector(target);
  div.style.display = "block";
};
