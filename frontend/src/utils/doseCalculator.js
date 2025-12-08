export function calculateDoses(w) {
  const { turbidity, cod, bod, tds } = w;

  return {
    alum: Math.round(turbidity * 0.3),
    pac: Math.round(turbidity > 100 ? turbidity * 0.5 : 0),
    polymer: turbidity < 10 ? 1 : 0,
    chlorine: Math.round(bod * 0.1),
    antiscalant: tds > 1500 ? 4 : 0,
    ozone: cod > 250 ? Math.round(cod * 0.2) : 0,
  };
}
