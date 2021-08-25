let equations, iterations, estimate, n, error;

function calculate() {
  equations = new Array(n);
  estimate = new Array(n);
  for (let i = 0; i < n; i++) {
    let input = document.getElementById(`input-${i}-1`).value;
    let result = document.getElementById(`input-${i}-2`).value;
    let inputTable = document.getElementById(`input-${i}-3`).value;
    if (!input) {
      alert(`Insira uma equação na área ${i + 1}.`);
      return;
    }
    if (!result) {
      alert(`Insira uma equação como resultado da expressão ${i + 1}.`);
      return;
    }
    equations[i] = new Function(`x`, `return ` + formattingExpression(input) + `-(` + formattingExpression(result) + `);`);

    // fazer o campo de estimativa no HTML
    estimate[i] = parseFloat(document.getElementById(inputTable).value);
    if (isNaN(estimate[i])) {
      alert(`Insira um número real como estimativa inicial do x[${i}]`);
      return;
    }
  }
  showResult(gaussMethod());
}


function subtractVector(a, b) {
  let vectorSize = a.length;
  for (let i = 0; i < vectorSize; i++) {
    a[i] -= b[i] * 0.5;
  }
  return a;
}

function GradientMatrix() {
  let X = new Array(n);
  let aux = estimate;
  let h = 1e-10;
  for (let i = 0; i < n; i++) {
    X[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      aux[j] += h;
      X[i][j] = equations[i](aux);
      aux[j] -= 2 * h;
      X[i][j] -= equations[i](aux);
      aux[j] += h;
      X[i][j] /= (2 * h);
    }
  }
  return X;
}

function totalPivoGauss(A, b) {
  let xPosition = [];
  for (let i = 0; i < n; i++) {
    xPosition.push(i);
  }
  for (let i = 0; i < n; i++) {
    let line = i, column = i;
    for (let j = i + 1; j < n; j++) {
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[j][k]) > Math.abs(A[line][column])) {
          line = j;
          column = k;
        }
      }
    }

    if (line != i) {
      let aux;
      aux = b[i];
      b[i] = b[column];
      b[column] = aux;
      for (let j = i; j < n; j++) {
        aux = A[i][j];
        A[i][j] = A[line][j];
        A[line][j] = aux;
      }
    }
    if (column != i) {
      let aux;
      aux = xPosition[i];
      xPosition[i] = xPosition[column];
      xPosition[column] = aux;
      for (let j = 0; j < n; j++) {
        aux = A[j][i];
        A[j][i] = A[j][column];
        A[j][column] = aux;
      }
    }
    for (let j = i + 1; j < n; j++) {
      let m = A[j][i] / A[i][i];
      for (let k = i; k < n; k++) {
        A[j][k] -= A[i][k] * m;
      }
      b[j] -= b[i] * m;
    }
  }
  for (let i = 0; i < n; i++) {
    if (A[i][i] == 0) A[i][i] = 1e-10;
  }
  let x = [];
  for (let i = 0; i < n; i++) {
    x.push(null);
  }
  for (let i = n - 1; i > -1; i--) {
    let R = b[i];
    for (let j = i + 1; j < n; j++) {
      R -= x[xPosition[j]] * A[i][j];
    }
    x[xPosition[i]] = R / A[i][i];
  }
  return x;
}

function gaussMethod() {
  let X = new Array(n);
  let estimateAux, aux;

  for (let i = 0; i < n; i++) {
    X[i] = equations[i](estimate);
  }
  estimate = subtractVector(estimate, totalPivoGauss(GradientMatrix(), X));
  do {
    estimateAux = [...estimate];
    for (let i = 0; i < n; i++) {
      X[i] = equations[i](estimate);
    }
    estimate = subtractVector(estimate, totalPivoGauss(GradientMatrix(), X));
    iterations--;
    aux = false;
    for (let i = 0; i < n; i++)
      if (Math.abs(estimate[i] - estimateAux[i]) > error)
        aux = true;
  } while (iterations > 0 && aux);
  return estimate;
}