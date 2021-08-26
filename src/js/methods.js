function calculate() {

  ({ n, epsilon, iterations, func, y, estimate } = getInput());

  if (func.length <= 0) {
    alert(`Insira uma equação na área.`);
    return;
  }
  if (y.length <= 0) {
    alert(`Insira um resultado.`);
    return;
  }
  for(let i = 0;  i<n ; i++) {
  func[i] = createMathFunction(`${func[i]} - (${y[i]})`,"x");
  }
  if (estimate.length <= 0) {
    alert("Inserir um número real como estimativa inicial");
    return;
  }
  showResult("#result-div", gaussMethod(n, epsilon, iterations, func, estimate));
}

function subtractVector(a, b) {
  let vectorSize = a.length;
  for (let i = 0; i < vectorSize; i++) {
    a[i] -= b[i] * 0.5;
  }
  return a;
}

function GradientMatrix(n, func, estimate) {
  let X = new Array(n);
  let aux = estimate;
  let h = 1e-10;
  for (let i = 0; i < n; i++) {
    X[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      aux[j] += h;
      X[i][j] = func[i](aux);
      aux[j] -= 2 * h;
      X[i][j] -= func[i](aux);
      aux[j] += h;
      X[i][j] /= 2 * h;
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
    let line = i,
      column = i;
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
    let result = b[i];
    for (let j = i + 1; j < n; j++) {
      result -= x[xPosition[j]] * A[i][j];
    }
    x[xPosition[i]] = result / A[i][i];
  }
  return x;
}

function gaussMethod(n, epsilon, iterations, func, estimate) {
  let X = new Array(n);
  let estimateAux, aux;

  for (let i = 0; i < n; i++) {
    X[i] = func[i](estimate);
  }
  estimate = subtractVector(estimate, totalPivoGauss(GradientMatrix(n, func, estimate), X));
  do {
    estimateAux = [...estimate];
    for (let i = 0; i < n; i++) {
      X[i] = func[i](estimate);
    }
    estimate = subtractVector(estimate, totalPivoGauss(GradientMatrix(n, func, estimate), X));
    iterations--;
    aux = false;
    for (let i = 0; i < n; i++)
      if (Math.abs(estimate[i] - estimateAux[i]) > epsilon) aux = true;
  } while (iterations > 0 && aux);
  return estimate;
}
