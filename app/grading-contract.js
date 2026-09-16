export function normalizedAnswer(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function detectRequestedCount(question = '') {
  const text = normalizedAnswer(question);
  // Compound tasks need a holistic verdict: merely counting terms must not
  // satisfy a separately requested explanation, comparison, or second group.
  if (/\bje\b|\bjeweils\b|\bund\s+(?:erlautere|erklare|begrunde|beschreibe|gib)\b/.test(text)) return null;
  const words = {eins:1,eine:1,einen:1,zwei:2,drei:3,vier:4,funf:5,fuenf:5,sechs:6};
  const numbers = '(eins|eine|einen|zwei|drei|vier|funf|fuenf|sechs|[1-6])';
  const matches = [...text.matchAll(new RegExp('\\b'+numbers+'\\s+(?:(?:mogliche|weitere|praktische|typische)\\s+)?(?:punkte|grunde|kriterien|beispiele|ursachen|folgen|schritte|informationen|angaben|kennzahlen|grossen|belastungen|moglichkeiten|massnahmen|vorteile|nachteile|risiken|faktoren|anforderungen|fehler|kostenarten|begriffe)\\b','g'))];
  if(matches.length > 1) return null;
  const direct=text.match(new RegExp('\\b(?:nenne|nenn|gib|beschreibe|erklare|erlautere|zeige|formuliere)\\s+'+numbers+'\\b'));
  const value=(direct||matches[0])?.[1];
  return value ? words[value]||Number(value) : null;
}

export function parseLocalizedNumber(value = '') {
  // Accept one number and an optional unit, never silently join arithmetic or prose.
  const match = String(value).trim().match(/^([+-]?\d[\d.,]*)(?:\s*(?:€|%|kg\/m²|kg|g|t|N|m|m²|m³|cm|mm|km|h|min|s|Stück|Stk\.?|Tage?|Euro))?$/i);
  if (!match) return null;
  let number = match[1];
  if (/^[+-]?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(number)) number = number.replace(/\./g, '').replace(',', '.');
  else if (/^[+-]?\d{1,3}(?:,\d{3})+\.\d+$/.test(number)) number = number.replace(/,/g, '');
  else if (/^[+-]?\d+(?:[.,]\d+)?$/.test(number)) number = number.replace(',', '.');
  else return null;
  return Number.isFinite(Number(number)) ? Number(number) : null;
}
