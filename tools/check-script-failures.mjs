import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Static authoring check only: this does not parse or compile Velox scripts.
export function executablePascal(source) {
  let output = '', i = 0;
  const blank = c => c === '\n' ? '\n' : ' ';
  while (i < source.length) {
    if (source[i] === "'") {
      output += ' '; i++;
      while (i < source.length) {
        if (source[i] === "'" && source[i+1] === "'") { output += '  '; i += 2; }
        else if (source[i] === "'") { output += ' '; i++; break; }
        else output += blank(source[i++]);
      }
    } else if (source.startsWith('//', i)) {
      while (i < source.length && source[i] !== '\n') output += blank(source[i++]);
    } else if (source[i] === '{' || source.startsWith('(*', i)) {
      const close = source[i] === '{' ? '}' : '*)', length = close === '}' ? 1 : 2;
      output += ' '.repeat(length); i += length;
      while (i < source.length && !source.startsWith(close, i)) output += blank(source[i++]);
      if (i < source.length) { output += ' '.repeat(close.length); i += close.length; }
    } else output += source[i++];
  }
  return output;
}

export function forbiddenTokens(source) {
  const executable = executablePascal(source), issues = [];
  for (const match of executable.matchAll(/\braise\b|\bException\s*\.\s*Create\b|\bRaise(?:Last)?Exception\b/gi)) {
    const prefix = executable.slice(0, match.index);
    if (/^Raise(?:Last)?Exception$/i.test(match[0]) && /\b(?:procedure|function)\s*$/i.test(prefix)) continue;
    issues.push({line: prefix.split('\n').length, token: match[0]});
  }
  return issues;
}

export function decodeFormulaLists(source) {
  const formulas = [];
  for (const match of source.matchAll(/\b(?:\w*Formula|GlobalScript|Script)\.Strings\s*=\s*\(/gi)) {
    let i = match.index + match[0].length, text = '', join = false, haveItem = false;
    while (i < source.length) {
      const char = source[i];
      if (char === ')') break;
      if (char === '+') { join = true; i++; continue; }
      if (char === "'") {
        if (haveItem && !join) text += '\n';
        i++; let item = '';
        while (i < source.length) {
          if (source[i] === "'" && source[i+1] === "'") { item += "'"; i += 2; }
          else if (source[i] === "'") { i++; break; }
          else item += source[i++];
        }
        text += item; haveItem = true; join = false; continue;
      }
      if (char === '#') {
        const number = source.slice(i).match(/^#(\$[0-9a-f]+|\d+)/i);
        if (number) {
          text += String.fromCharCode(number[1][0] === '$' ? parseInt(number[1].slice(1), 16) : Number(number[1]));
          i += number[0].length; join = true; haveItem = true; continue;
        }
      }
      i++;
    }
    formulas.push({line: source.slice(0, match.index).split('\n').length, text});
  }
  return formulas;
}

export function fencedBlocks(source) {
  const lines = source.split(/\r?\n/), blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const opening = lines[i].match(/^ {0,3}(\x60{3,}|~{3,})(.*)$/);
    if (!opening) continue;
    const start = i, marker = opening[1], metadata = opening[2].trim(), body = [];
    while (++i < lines.length) {
      const closing = lines[i].match(/^ {0,3}(\x60{3,}|~{3,})\s*$/);
      if (closing && closing[1][0] === marker[0] && closing[1].length >= marker.length) break;
      body.push(lines[i]);
    }
    blocks.push({metadata, text: body.join('\n'), line: start + 2});
  }
  return blocks;
}

function roleIssues(file, metadata) {
  const role = metadata.match(/\bvelox-role="([^"]+)"/)?.[1];
  if (!role) return {skip: false};
  if (!metadata.match(/\breason="([^"]+)"/)?.[1]?.trim()) return {error: 'Exemption needs a nonempty reason.'};
  if (!['invalid','api-reference','native-delphi'].includes(role)) return {error: 'Unknown velox-role: ' + role};
  if (role === 'api-reference' && !(file.startsWith('CodeLibrary/Functions/Exceptions/') ||
    file === 'CodeLibrary/Types/Enumerations/TIFException.md' ||
    file === 'CodeLibrary/Constants/Enumeration/erCustomError.md')) {
    return {error: 'api-reference exemption is restricted to exception API reference pages.'};
  }
  return {skip: true, role};
}

export function checkSource(file, source) {
  file = file.replaceAll('\\','/');
  const issues = [], exemptions = [];
  let scripts = 0, formulas = 0;
  const scan = (code, line, origin) => {
    scripts++;
    for (const issue of forbiddenTokens(code)) issues.push({...issue,line:line+issue.line-1,origin});
  };
  const scanFormulas = (code, line) => {
    for (const formula of decodeFormulaLists(code)) {
      formulas++;
      scan(formula.text,line+formula.line-1,'decoded CFG formula (approximate source line)');
    }
  };
  if (/\.md$/i.test(file)) {
    for (const block of fencedBlocks(source)) {
      const language = block.metadata.split(/\s/)[0].toLowerCase(), role = roleIssues(file,block.metadata);
      if (role.error) { issues.push({line:block.line-1,token:role.error,origin:'annotation'}); continue; }
      if (role.skip) { exemptions.push({line:block.line-1,role:role.role}); continue; }
      if (language === 'sql') continue;
      scanFormulas(block.text,block.line);
      if (['pascal','delphi','velox','velox-script'].includes(language) ||
          (['','text'].includes(language) && forbiddenTokens(block.text).length) ||
          (/\b(?:procedure|function)\s+\w+/i.test(block.text) && /\bbegin\b/i.test(block.text) && !decodeFormulaLists(block.text).length)) {
        scan(block.text,block.line,'recommended script');
      }
    }
  } else if (/\.cfg$/i.test(file)) scanFormulas(source,1);
  else if (/\.(pas|inc)$/i.test(file)) {
    const role=roleIssues(file,source.split(/\r?\n/)[0]);
    if (role.error) issues.push({line:1,token:role.error,origin:'annotation'});
    else if (role.skip) exemptions.push({line:1,role:role.role});
    else scan(source,1,'script source');
  } else if (/\.txt$/i.test(file)) {
    scanFormulas(source,1);
    if (/\b(?:procedure|function)\s+\w+/i.test(source) && /\bbegin\b/i.test(source)) scan(source,1,'script source in text file');
  }
  return {issues,exemptions,scripts,formulas};
}

export function scanRepository(root) {
  const files=[], excluded=new Set(['.git','node_modules','build','.docusaurus','.generated']);
  const visit=dir => {
    for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
      if(excluded.has(item.name)) continue;
      const full=path.join(dir,item.name);
      if(item.isDirectory()) visit(full);
      else if(/\.(md|cfg|pas|inc|txt)$/i.test(item.name)) files.push(full);
    }
  };
  visit(root);
  const report={files:files.length,scripts:0,formulas:0,issues:[],exemptions:[]};
  for(const file of files) {
    const relative=path.relative(root,file).replaceAll('\\','/'), result=checkSource(relative,fs.readFileSync(file,'utf8'));
    report.scripts+=result.scripts; report.formulas+=result.formulas;
    report.issues.push(...result.issues.map(issue=>({file:relative,...issue})));
    report.exemptions.push(...result.exemptions.map(item=>({file:relative,...item})));
  }
  return report;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2), rootOption=args.indexOf('--root');
  const root=rootOption>=0?args[rootOption+1]:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  if(!root) throw new Error('--root requires a directory');
  const report=scanRepository(path.resolve(root));
  if(args.includes('--json')) console.log(JSON.stringify(report,null,2));
  else {
    for(const issue of report.issues) console.error(issue.file+':'+issue.line+': '+issue.token+' ['+issue.origin+']');
    console.log('Checked '+report.scripts+' script/declaration blocks, including '+report.formulas+' decoded CFG formulas, in '+report.files+' files.');
    console.log('Explicitly labelled exemptions: '+report.exemptions.length+'. Violations: '+report.issues.length+'.');
    console.log('Static check only; no successful Velox compilation or runtime execution is implied.');
  }
  process.exitCode=report.issues.length?1:0;
}
