import algebra from 'algebra.js';
const { Equation } = algebra;

export default (total) => {
  const additionalCostList = {
    6: 250000,
    5: 250000,
    4: 500000,
    3: 500000,
    2: 500000,
    1: 500000,
  };
  const highest = Math.floor(total / 7);
  let bestR = 0;
  let best = null;
  for (let s7 = highest; s7 >= 0; s7--) {
    const x1 = algebra.parse(`-8/7y + ${total}/7`);
    const eq = new Equation(x1, s7);
    const s8e = eq.solveFor('y');
    const s8r = s8e.numer / s8e.denom;
    const s8 = Math.floor(s8r);
    const r = (s8r - s8) * 8;
    const cost = additionalCostList[r];
    const result = {
      total,
      s7,
      s8,
      rem: r,
      calcRem: total >= 50 ? 0 : r,
      cost,
      calcCost: total >= 50 ? 0 : cost,
    };
    if (r === 0) {
      return result;
    } else if (bestR < r) {
      bestR = r;
      best = result;
    }
  }
  return best;
};
