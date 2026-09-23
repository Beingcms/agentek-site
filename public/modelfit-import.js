// Parse and preview locally; only the review screen can submit a save request.
export const LIMITS = Object.freeze({fileBytes: 1048576, requestBytes: 1048576, rows: 200, input: 4000, answer: 2000, group: 100});
export class ImportError extends Error {
  constructor(code, message, details = {}) { super(message); this.name = 'ImportError'; this.code = code; this.details = details; }
}
const fail = (code, message, details) => { throw new ImportError(code, message, details); };
const bytes = value => new TextEncoder().encode(value).byteLength;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const normalInput = value => value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
const normalHeading = value => value.normalize('NFKC').trim().toLowerCase().replace(/[\s_-]+/g, '');
const forbiddenControls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;

// Detect the separator from the heading row: comma, semicolon (European Excel) or tab.
export function detectDelimiter(text) {
  const counts = {',': 0, ';': 0, '\t': 0};
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && (char === '\n' || char === '\r')) break;
    else if (!quoted && char in counts) counts[char]++;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : ',';
}

// Column identity is positional. Duplicate or blank labels remain distinguishable.
export function parseCSV(text) {
  if (typeof text !== 'string') fail('file_text', 'The file must contain UTF-8 text.');
  if (bytes(text) > LIMITS.fileBytes) fail('file_too_large', 'Choose a file no larger than 1 MB.');
  text = text.replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(text);
  const records = [];
  let values = [], field = '', state = 'start', line = 1, rowLine = 1;
  const finishField = () => { values.push(field); field = ''; state = 'start'; };
  const finishRecord = () => {
    // Ignore blank physical lines, but keep empty cells in an actual CSV row.
    if (values.length !== 1 || values[0].trim()) records.push({values, line: rowLine});
    values = [];
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (state === 'quoted') {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else state = 'closed';
      } else {
        field += char;
        if (char === '\n' || char === '\r' && text[i + 1] !== '\n') line++;
      }
      continue;
    }
    if (char === delimiter) { finishField(); continue; }
    if (char === '\n' || char === '\r') {
      finishField(); finishRecord();
      if (char === '\r' && text[i + 1] === '\n') i++;
      line++; rowLine = line; continue;
    }
    if (state === 'closed') fail('csv_quotes', `Unexpected text after a closing quote on line ${line}.`, {line});
    if (char === '"') {
      if (state !== 'start') fail('csv_quotes', `A quote must start a CSV cell on line ${line}.`, {line});
      state = 'quoted';
    } else { field += char; state = 'bare'; }
  }
  if (state === 'quoted') fail('csv_quotes', `An opened quote was not closed in the row starting on line ${rowLine}.`, {line: rowLine});
  if (values.length || field || state === 'closed') { finishField(); finishRecord(); }
  if (records.length < 2) fail('no_rows', 'Include column headings and at least one example.');
  const header = records.shift();
  const columns = header.values.map((label, index) => ({id: `c${index}`, index, label: label.trim(), display: `${label.trim() || 'Unnamed column'} (column ${index + 1})`}));
  const rows = records.map((record, index) => {
    if (record.values.length !== columns.length) fail('csv_columns', `The row starting on line ${record.line} has ${record.values.length} cells; the headings have ${columns.length}.`, {line: record.line});
    return {id: `r${index}`, sourceRow: record.line, values: record.values};
  });
  if (rows.length > LIMITS.rows) fail('too_many_file_rows', `This file has ${rows.length} examples. Import at most ${LIMITS.rows} at a time: split the file and import each part.`, {rows: rows.length});
  return {format: 'csv', columns, rows};
}

function uniqueJSON(text) {
  // First validate JSON syntax; then scan its keys before using the parsed data.
  // Native JSON.parse alone silently overwrites repeated properties.
  const parsed = JSON.parse(text), contexts = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '{') { contexts.push({type: 'object', keys: new Set(), expectKey: true}); continue; }
    if (char === '[') { contexts.push({type: 'array'}); continue; }
    if (char === '}' || char === ']') { contexts.pop(); continue; }
    const context = contexts.at(-1);
    if (char === ',' && context?.type === 'object') { context.expectKey = true; continue; }
    if (char !== '"') continue;
    const start = i;
    for (i++; i < text.length; i++) {
      if (text[i] === '\\') i++;
      else if (text[i] === '"') break;
    }
    if (context?.type === 'object' && context.expectKey) {
      const key = JSON.parse(text.slice(start, i + 1));
      if (context.keys.has(key)) fail('json_duplicate_key', `JSON repeats the field “${key.slice(0,80)}”. Give every field a distinct name before importing.`, {key});
      context.keys.add(key); context.expectKey = false;
    }
  }
  return parsed;
}

export function parseImport(text, format) {
  if (typeof text !== 'string') fail('file_text', 'The file must contain UTF-8 text.');
  if (bytes(text) > LIMITS.fileBytes) fail('file_too_large', 'Choose a file no larger than 1 MB.');
  text = text.replace(/^\uFEFF/, '');
  if (format === 'csv') return parseCSV(text);
  if (!['json', 'jsonl'].includes(format)) fail('file_format', 'Choose CSV, JSON or JSONL for column mapping. TXT continues to fill one input for review.');
  let records;
  try {
    if (format === 'jsonl') records = text.split(/\r\n|\n|\r/).flatMap((line, index) => {
      if (!line.trim()) return [];
      try { return [{value: uniqueJSON(line), line: index + 1}]; }
      catch (error) {
        if (error instanceof ImportError) throw error;
        fail('invalid_json', `Line ${index + 1} is not valid JSON. Fix or remove that line, then import again.`, {line: index + 1});
      }
    });
    else {
      const parsed = uniqueJSON(text), array = Array.isArray(parsed) ? parsed : parsed?.examples;
      if (!Array.isArray(array)) fail('json_rows', 'JSON must be an array of examples or an object with an examples array.');
      records = array.map((value, index) => ({value, line: index + 1}));
    }
  } catch (error) {
    if (error instanceof ImportError) throw error;
    fail('invalid_json', 'The file is not valid JSON. Check its syntax before importing.');
  }
  records = records.map(record => ({...record, value: fromChat(record.value)}));
  if (!records.length) fail('no_rows', 'Include at least one example.');
  if (records.length > LIMITS.rows) fail('too_many_file_rows', `This file has ${records.length} examples. Import at most ${LIMITS.rows} at a time: split the file and import each part.`, {rows: records.length});
  const keys = new Set();
  for (const record of records) {
    if (!record.value || typeof record.value !== 'object' || Array.isArray(record.value)) fail('json_row', `Example ${record.line} must be an object with named fields.`, {row: record.line});
    Object.keys(record.value).forEach(key => keys.add(key));
  }
  const names = [...keys];
  const columns = names.map((label, index) => ({id: `c${index}`, index, label, display: `${label || 'Unnamed field'} (column ${index + 1})`}));
  const rows = records.map((record, index) => ({id: `r${index}`, sourceRow: record.line, values: names.map(key => own(record.value, key) ? record.value[key] : undefined)}));
  return {format, columns, rows};
}

// Chat fine-tuning format: user turns become the input, the last assistant turn the answer.
function fromChat(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.messages)) return value;
  const text = m => typeof m?.content === 'string' ? m.content : '';
  const user = value.messages.filter(m => m?.role === 'user').map(text).filter(Boolean);
  const assistant = value.messages.filter(m => m?.role === 'assistant').map(text).filter(Boolean);
  if (!user.length || !assistant.length) return value;
  const {messages, ...rest} = value;
  return {...rest, input: user.join('\n'), answer: assistant.at(-1)};
}

const aliases = {
  input: ['input', 'prompt', 'question', 'message', 'text', 'query', 'instruction', 'request', 'userinput'],
  answer: ['answer', 'expectedanswer', 'correctanswer', 'response', 'completion', 'label', 'target', 'output', 'expected', 'expectedoutput', 'reply', 'idealanswer'],
  group_id: ['groupid', 'caseid', 'documentid', 'sourceid']
};
export function guessMapping(table) {
  const mapping = {}, ambiguous = {};
  for (const [field, names] of Object.entries(aliases)) {
    const canonical = table.columns.filter(column => normalHeading(column.label) === names[0]);
    const candidates = canonical.length ? canonical : table.columns.filter(column => names.includes(normalHeading(column.label)));
    mapping[field] = candidates.length === 1 ? candidates[0].id : null;
    if (candidates.length > 1) ambiguous[field] = candidates.map(column => column.id);
  }
  return {mapping, ambiguous};
}

function textError(value, label, max) {
  if (typeof value !== 'string') return `${label} must be text, not a number, object or empty value.`;
  if (!value.trim()) return `${label} is empty.`;
  if (value.length > max) return `${label} exceeds ${max.toLocaleString('en-US')} characters.`;
  if (forbiddenControls.test(value)) return `${label} contains an unsupported control character.`;
  return null;
}
function checkExisting(existing) {
  if (!Array.isArray(existing) || existing.length > LIMITS.rows) fail('existing_invalid', 'Reload the saved examples before importing.');
  const ids = new Set(), inputs = new Set();
  for (const row of existing) {
    if (!row || textError(row.id, 'ID', 100) || textError(row.input, 'Input', LIMITS.input) || textError(row.answer, 'Answer', LIMITS.answer)
      || textError(row.group_id, 'Related case', LIMITS.group) || typeof row.reviewed !== 'boolean' || ids.has(row.id) || inputs.has(normalInput(row.input)))
      fail('existing_invalid', 'Reload and check the saved examples before importing.');
    ids.add(row.id); inputs.add(normalInput(row.input));
  }
}

export function analyseImport(table, mapping, existing = []) {
  checkExisting(existing);
  const columns = new Map(table.columns.map(column => [column.id, column.index]));
  const errors = [];
  for (const field of ['input', 'answer']) if (!columns.has(mapping[field])) errors.push(`Choose a column for ${field === 'input' ? 'the input' : 'the correct answer'}.`);
  if (mapping.group_id != null && !columns.has(mapping.group_id)) errors.push('Choose a valid related-case column, or select None.');
  const chosen = ['input', 'answer', 'group_id'].map(field => mapping[field]).filter(value => value != null);
  if (new Set(chosen).size !== chosen.length) errors.push('Use different columns for the input, answer and related-case label.');
  if (errors.length) return {mappingErrors: errors, existing: existing.map(row => ({...row})), rows: [], groups: []};
  const rows = table.rows.map(record => {
    const input = record.values[columns.get(mapping.input)], answer = record.values[columns.get(mapping.answer)];
    const group = mapping.group_id == null ? null : record.values[columns.get(mapping.group_id)];
    const errors = [textError(input, 'Input', LIMITS.input), textError(answer, 'Correct answer', LIMITS.answer)];
    if (group != null && !(typeof group === 'string' && !group.trim())) errors.push(textError(group, 'Related-case label', LIMITS.group));
    return {id: record.id, sourceRow: record.sourceRow, input: typeof input === 'string' ? input.trim() : input,
      answer: typeof answer === 'string' ? answer.trim() : answer, group_id: typeof group === 'string' ? group.trim() || null : group,
      errors: errors.filter(Boolean)};
  });
  const matches = new Map();
  for (const row of rows.filter(row => !row.errors.length)) {
    const key = normalInput(row.input);
    if (!matches.has(key)) matches.set(key, {saved: existing.filter(saved => normalInput(saved.input) === key), imported: []});
    matches.get(key).imported.push(row);
  }
  const groups = [...matches.entries()].map(([key, {saved, imported}], index) => {
    const all = saved.concat(imported), answers = new Set(all.map(row => row.answer.trim()));
    const labels = new Set(saved.map(row => row.group_id === row.id ? null : row.group_id).concat(imported.map(row => row.group_id || null)));
    // A bad answer does not erase an otherwise valid declaration that the input
    // belongs to a document/case, even when the user skips that invalid row.
    for (const row of rows) if (row.group_id && !textError(row.input, 'Input', LIMITS.input)
      && !textError(row.group_id, 'Related case', LIMITS.group) && normalInput(row.input) === key) labels.add(row.group_id);
    const reasons = [...(answers.size > 1 ? ['answer'] : []), ...(labels.size > 1 ? ['related_case'] : [])];
    const kind = reasons.length ? 'conflict' : all.length === 1 ? 'new' : 'duplicate';
    const group = {id: `g${index}`, kind, reasons, declaredGroups: [...labels].filter(Boolean), savedIds: saved.map(row => row.id), rowIds: imported.map(row => row.id)};
    imported.forEach(row => { row.group = group.id; row.status = kind; });
    return group;
  });
  rows.filter(row => row.errors.length).forEach(row => { row.status = 'invalid'; });
  return {mappingErrors: [], existing: existing.map(row => ({...row})), rows, groups};
}

// New rows are included by default. Every invalid, duplicate or conflict row
// requires an explicit keep/skip decision. Saved examples cannot be overwritten.
export function buildImportRequest(analysis, decisions = {}, {revision, dataRightsConfirmed, createId = () => crypto.randomUUID()} = {}) {
  if (!Number.isInteger(revision) || revision < 0) fail('revision', 'Reload this task before importing.');
  if (dataRightsConfirmed !== true) fail('data_rights', 'Confirm that you may use these examples.');
  if (analysis.mappingErrors.length) fail('mapping_required', analysis.mappingErrors.join(' '));
  checkExisting(analysis.existing);
  if (!decisions || typeof decisions !== 'object' || Array.isArray(decisions)) fail('decision_invalid', 'Use explicit Import or Skip decisions.');
  const ids = new Set(analysis.rows.map(row => row.id));
  for (const [id, decision] of Object.entries(decisions)) if (!ids.has(id) || !['keep', 'skip'].includes(decision)) fail('decision_invalid', 'A row decision is invalid. Check the current preview.');
  const picked = [];
  for (const row of analysis.rows) {
    const decision = own(decisions, row.id) ? decisions[row.id] : row.status === 'new' ? 'keep' : null;
    if (!decision) fail('decision_required', `Choose what to do with imported row ${row.sourceRow}.`, {row: row.id});
    if (decision === 'skip') continue;
    if (row.errors.length) fail('row_invalid', `Correct or skip imported row ${row.sourceRow}.`, {row: row.id, errors: row.errors});
    const group = analysis.groups.find(group => group.id === row.group);
    if (group.savedIds.length) fail('saved_example_preserved', `Imported row ${row.sourceRow} matches a saved input. Skip it or correct the file; saved examples are preserved.`, {row: row.id});
    if (!row.group_id && group.declaredGroups.length) fail('related_case_required', `Imported row ${row.sourceRow} is missing a case label that a matching row supplies. Choose a labelled row or correct the file so related examples stay together.`, {row: row.id});
    picked.push(row);
  }
  if (!picked.length) fail('nothing_to_import', 'No new examples are selected. Your saved examples have not changed.');
  const inputs = new Set();
  for (const row of picked) {
    const key = normalInput(row.input);
    if (inputs.has(key)) fail('duplicate_unresolved', 'Choose at most one imported row for each matching input.');
    inputs.add(key);
  }
  if (analysis.existing.length + picked.length > LIMITS.rows) fail('example_limit', `This would save ${analysis.existing.length + picked.length} examples. Keep at most 200 in this task.`);
  const usedIds = new Set(analysis.existing.map(row => row.id));
  const imported = picked.map(row => {
    const id = createId();
    if (textError(id, 'ID', 100) || id !== id.trim() || usedIds.has(id)) fail('id_invalid', 'Could not assign a unique example ID. Reopen the preview.');
    usedIds.add(id);
    return {id, input: row.input, answer: row.answer, group_id: row.group_id || id, reviewed: false};
  });
  const request = {revision, examples: analysis.existing.map(row => ({...row})).concat(imported), data_rights_confirmed: true};
  const requestBytes = bytes(JSON.stringify(request));
  if (requestBytes > LIMITS.requestBytes) fail('request_too_large', 'The saved and selected examples exceed the 1 MB request limit. Import fewer examples or shorten the text.', {requestBytes, limit: LIMITS.requestBytes});
  return {request, importedCount: imported.length, skippedCount: analysis.rows.length - imported.length, requestBytes};
}
