function leftRectangleRuleMethod({ func, a, b, epsilon }) {
  if (func || a || b || epsilon) {
    f = createMathFunction(func, "x");
    let n = 10;
    let sum = 0;
    let q, x;
    let h = (b - a) / n;
    for (let i = 0; i < n; i++) {
      x = a + i * h;
      sum += f(x);
    }
    sum *= h;
    do {
      q = sum;
      n *= 2;
      h = (b - a) / n;
      sum = 0;
      for (let i = 0; i < n; i++) {
        x = a + i * h;
        sum += f(x);
      }
      sum *= h;
    } while (Math.abs(sum - q) > epsilon);
    return sum;
  }
  return "Invalid inputs";
}

function rightRectangleRuleMethod({ func, a, b, epsilon }) {
  if (func || a || b || epsilon) {
    let f = createMathFunction(func, "x");
    let n = 10;
    let sum = 0;
    let q, x;
    let h = (b - a) / n;
    for (let i = 1; i <= n; i++) {
      x = a + i * h;
      sum += f(x);
    }
    sum *= h;
    do {
      q = sum;
      n *= 2;
      h = (b - a) / n;
      sum = 0;
      for (let i = 1; i <= n; i++) {
        x = a + i * h;
        sum += f(x);
      }
      sum *= h;
    } while (Math.abs(sum - q) > epsilon);
    return sum;
  }
  return "Invalid inputs";
}

function trapezoidolRuleMethod({ func, a, b, epsilon }) {
  if (func || a || b || epsilon) {
    const f = createMathFunction(func, "x");
    let n = 10;
    let p = (f(a) + f(b)) / 2,
      q;
    let h = (b - a) / n;
    for (let i = 0; i < n; i++) {
      x = a + i * h;
      p += f(x);
    }
    p *= h;
    do {
      q = p;
      n *= 2;
      h = (b - a) / n;
      p = (f(a) + f(b)) / 2;
      for (let i = 0; i < n; i++) {
        x = a + i * h;
        p += f(x);
      }
      p *= h;
    } while (Math.abs(p - q) > epsilon);
    return p;
  }
  return "Invalid inputs";
}

function simpson13RuleMethod({ func, a, b, epsilon }) {
  if (func || a || b || epsilon) {
    const f = createMathFunction(func, "x");
    let n = 10;
    let p = 0,
      q;
    let h = (b - a) / n;

    for (let i = 0; i < n; i += 2) {
      p +=
        (h / 3) * (f(a + i * h) + 4 * f(a + (i + 1) * h) + f(a + (i + 2) * h));
    }
    do {
      q = p;
      n *= 2;
      let h = (b - a) / n;
      p = 0;
      for (let i = 0; i < n; i += 2) {
        p +=
          (h / 3) *
          (f(a + i * h) + 4 * f(a + (i + 1) * h) + f(a + (i + 2) * h));
      }
    } while (Math.abs(p - q) > epsilon);
    return p;
  }
  return "Invalid inputs";
}

function simpson38RuleMethod({ func, a, b, epsilon }) {
  if (func || a || b || epsilon) {
    const f = createMathFunction(func, "x");
    let n = 15,
      p = 0,
      q;
    let h = (b - a) / n;

    for (let i = 0; i < n; i += 3) {
      p +=
        (3 / 8) *
        h *
        (f(a + i * h) +
          3 * f(a + (i + 1) * h) +
          3 * f(a + (i + 2) * h) +
          f(a + (i + 3) * h));
    }
    do {
      q = p;
      n *= 3;
      let h = (b - a) / n;
      p = 0;
      for (let i = 0; i < n; i += 3) {
        p +=
          (3 / 8) *
          h *
          (f(a + i * h) +
            3 * f(a + (i + 1) * h) +
            3 * f(a + (i + 2) * h) +
            f(a + (i + 3) * h));
      }
    } while (Math.abs(p - q) > epsilon);
    return p;
  }
  return "Invalid inputs";
}

function GaussQuadratureMethod({ func, a, b }) {
  if (func || a || b) {
    const f = createMathFunction(func, "x");
    const W = [
      0.0271524594117540948517806, 0.0622535239386478928628438,
      0.0951585116824927848099251, 0.1246289712555338720524763,
      0.1495959888165767320815017, 0.1691565193950025381893121,
      0.1826034150449235888667637, 0.1894506104550684962853967,
      0.1894506104550684962853967, 0.1826034150449235888667637,
      0.1691565193950025381893121, 0.1495959888165767320815017,
      0.1246289712555338720524763, 0.0951585116824927848099251,
      0.0622535239386478928628438, 0.0271524594117540948517806,
    ];
    const T = [
      -0.9894009349916499325961542, -0.9445750230732325760779884,
      -0.8656312023878317438804679, -0.7554044083550030338951012,
      -0.6178762444026437484466718, -0.4580167776572273863424194,
      -0.2816035507792589132304605, -0.0950125098376374401853193,
      0.0950125098376374401853193, 0.2816035507792589132304605,
      0.4580167776572273863424194, 0.6178762444026437484466718,
      0.7554044083550030338951012, 0.8656312023878317438804679,
      0.9445750230732325760779884, 0.9894009349916499325961542,
    ];

    let p = 0;
    for (let i = 0; i < W.length; i++) {
      p +=
        W[i] * (((b - a) / 2) * f(a * ((1 - T[i]) / 2) + b * ((1 + T[i]) / 2)));
    }
    return p;
  }
  return "Invalid input";
}
