import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {executablePascal, fencedBlocks} from './check-script-failures.mjs';

// A limited, read-only text-stream structural check, not the Velox importer.
const dataClasses = new Set(['tvxdefdb', 'tvxdeffile']);
const actionRules = {
  tvxactionmap: {Source: ['tvxdefdb', 'tvxdeffile'], Dest: ['tvxdefdb', 'tvxdeffile']},
  tvxactiontransport: {Source: ['tvxdeffile']},
  tvxactioncustomscript: {Source: ['tvxdefdb', 'tvxdeffile']}
};
const lower = value => String(value || '').toLowerCase();

function scalar(raw, visible, line) {
  const text = visible.trim();
  if (text) return {kind: /^[A-Za-z_]\w*$/.test(text) ? 'identifier' : 'other', text, line};
  const string = raw.trim().match(/^'((?:''|[^'])*)'/);
  return string ? {kind: 'string', text: string[1].replaceAll("''", "'"), line} : {kind: 'empty', text: '', line};
}

export function parseComponents(source) {
  const raw = source.replace(/^\uFEFF/, '').split(/\r?\n/);
  const visible = executablePascal(source.replace(/^\uFEFF/, '')).split(/\r?\n/);
  const nodes = [], stack = [], issues = [];
  let aggregate = 0, pending;
  const delta = line => (line.match(/[([<]/g) || []).length - (line.match(/[)\]>]/g) || []).length;
  for (let i = 0; i < visible.length; i++) {
    const line = visible[i], number = i + 1;
    if (aggregate) { aggregate += delta(line); if (aggregate < 0) { issues.push({code:'parse-error', line:number, message:'Unbalanced serialized value.'}); aggregate=0; } continue; }
    const object = line.match(/^\s*(?:object|inherited|inline)\s+(\w+)(?:\s*:\s*(\w+))?\s*$/i);
    const property = line.match(/^\s*([\w.]+)\s*=(.*)$/);
    if (pending) {
      if (!line.trim()) continue;
      if (line.trim() && !object && !property && !/^\s*end\b/i.test(line)) {
        pending.node.props[lower(pending.name)] = scalar(raw[i],line,number);
        pending = undefined; continue;
      }
      pending = undefined;
    }
    if (object) {
      const node={name:object[1], type:object[2] || object[1], explicitName:!!object[2], line:number, props:{}, children:[], parent:stack.at(-1)};
      node.parent?.children.push(node); nodes.push(node); stack.push(node); continue;
    }
    if (/^\s*(?:object|inherited|inline)\b/i.test(line)) {
      issues.push({code:'parse-error',line:number,message:'Unrecognised component header; verify against native export.'}); continue;
    }
    if (/^\s*end\s*$/i.test(line)) {
      if (!stack.length) issues.push({code:'parse-error',line:number,message:'Unmatched component end.'});
      else stack.pop();
      continue;
    }
    if (property && stack.length) {
      const split=raw[i].indexOf('='), name=property[1], value=scalar(raw[i].slice(split+1),property[2],number);
      stack.at(-1).props[lower(name)]=value;
      aggregate=Math.max(0,delta(property[2]));
      if(value.kind==='empty' && !aggregate && /^(Source|Dest|ActionFIDS|FIDS|SourceType|DestType)$/i.test(name)) pending={node:stack.at(-1),name};
    }
  }
  if(aggregate) issues.push({code:'parse-error',line:raw.length,message:'Unclosed serialized value.'});
  if(stack.length) issues.push({code:'parse-error',line:stack.at(-1).line,message:'Unclosed component.'});
  return {nodes,issues};
}

function owningFlow(node) {
  for(let current=node.parent;current;current=current.parent) if(lower(current.type)==='tvxactionman') return current;
}

export function checkCfgBindings(source) {
  const parsed=parseComponents(source), issues=[...parsed.issues], warnings=[];
  const flows=parsed.nodes.filter(node=>lower(node.type)==='tvxactionman');
  const actions=parsed.nodes.filter(node=>Object.hasOwn(actionRules,lower(node.type)));
  const dataItems=parsed.nodes.filter(node=>dataClasses.has(lower(node.type)) && owningFlow(node));
  const modules=new Map();
  for(const node of parsed.nodes.filter(node=>lower(node.type)==='tvxmap')) {
    const id=lower(node.props.fids?.text);
    if(id) { if(!modules.has(id)) modules.set(id,[]); modules.get(id).push(node); }
  }
  const globalDataNames=new Map();
  for(const data of dataItems) {
    const name=lower(data.name), prefix=lower(data.type)==='tvxdefdb'?'vxDefDB':'vxDefFile';
    if(!new RegExp('^'+prefix+'[0-9]+$','i').test(data.name)) warnings.push({code:'naming-preference',line:data.line,message:'Prefer a unique '+prefix+'<number> component name; other names are not established as universally unsupported.'});
    if(globalDataNames.has(name) && owningFlow(globalDataNames.get(name))!==owningFlow(data)) warnings.push({code:'package-name-reuse',line:data.line,message:'A data component name is reused in another Flow; prefer package-unique names. References are still checked within their owner.'});
    else globalDataNames.set(name,data);
  }
  for(const flow of flows) {
    const local=dataItems.filter(node=>node.parent && lower(node.parent.type)==='tvxdefmanager' && node.parent.parent===flow);
    const grouped=new Map();
    for(const data of local) { const key=lower(data.name); if(!grouped.has(key))grouped.set(key,[]); grouped.get(key).push(data); }
    for(const group of grouped.values()) if(group.length>1) issues.push({code:'ambiguous-component',line:group[1].line,message:'Duplicate data component names within one Flow.'});
  }
  for(const action of actions) {
    const flow=owningFlow(action);
    if(!flow) { issues.push({code:'missing-owner',line:action.line,message:action.type+' has no owning TvxActionMan in this fragment.'}); continue; }
    const mapCandidates=modules.get(lower(action.props.actionfids?.text)) || [];
    const map=lower(action.type)==='tvxactionmap' && mapCandidates.length===1?mapCandidates[0]:undefined;
    if(lower(action.type)==='tvxactionmap' && !map) warnings.push({code:'map-contract-unverified',line:action.line,message:'Selected Map metadata is absent/ambiguous; checking data-component classes only, not its exact Definition/module contract.'});
    for(const [property,allowed] of Object.entries(actionRules[lower(action.type)])) {
      const reference=action.props[lower(property)];
      if(!reference || !reference.text || lower(reference.text)==='nil') { issues.push({code:'missing-reference',line:reference?.line || action.line,message:action.name+'.'+property+' requires an explicit Flow data-component reference.'}); continue; }
      if(reference.kind!=='identifier') { issues.push({code:'invalid-reference',line:reference.line,message:action.name+'.'+property+' must be an unquoted child component identifier, not a label, expression or module identity.'}); continue; }
      const candidates=parsed.nodes.filter(node=>node.explicitName && lower(node.name)===lower(reference.text));
      const local=candidates.filter(node=>node.parent && lower(node.parent.type)==='tvxdefmanager' && node.parent.parent===flow);
      if(local.length>1) { issues.push({code:'ambiguous-reference',line:reference.line,message:action.name+'.'+property+' resolves to multiple Flow children.'}); continue; }
      if(!local.length) {
        const code=candidates.some(node=>dataClasses.has(lower(node.type)))?'incorrect-owner':candidates.length?'incorrect-class':'unresolved-reference';
        issues.push({code,line:reference.line,message:action.name+'.'+property+' does not resolve to a compatible declared data item in this Flow.'}); continue;
      }
      const target=local[0];
      let expected=allowed;
      const mapType=lower(map?.props[property==='Source'?'sourcetype':'desttype']?.text);
      if(mapType==='fstdatabase') expected=['tvxdefdb'];
      else if(mapType==='fstfile') expected=['tvxdeffile'];
      else if(map) warnings.push({code:'map-type-unverified',line:reference.line,message:'Map data type is not covered by this check; native compatibility still needs verification.'});
      if(!expected.includes(lower(target.type))) issues.push({code:'incorrect-class',line:reference.line,message:action.name+'.'+property+' resolves to '+target.type+'; expected '+expected.join(' or ')+'.'});
    }
  }
  return {issues,warnings,flows:flows.length,actions:actions.length,dataItems:dataItems.length};
}

export function scanCfgBindings(root) {
  const report={files:0,fragments:0,flows:0,actions:0,dataItems:0,issues:[],warnings:[]};
  const excluded=new Set(['.git','node_modules','build','.docusaurus','.generated']);
  const inspect=(file,source,line=1)=>{
    const result=checkCfgBindings(source); report.fragments++;
    for(const key of ['flows','actions','dataItems']) report[key]+=result[key];
    for(const key of ['issues','warnings']) report[key].push(...result[key].map(item=>({file,line:item.line+line-1,code:item.code,message:item.message})));
  };
  const visit=dir=>{
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      if(excluded.has(entry.name))continue;
      const full=path.join(dir,entry.name);
      if(entry.isDirectory()){visit(full);continue;}
      if(!/\.(cfg|md)$/i.test(entry.name))continue;
      report.files++;
      const file=path.relative(root,full).replaceAll('\\','/'), source=fs.readFileSync(full,'utf8');
      if(/\.cfg$/i.test(entry.name))inspect(file,source);
      else for(const block of fencedBlocks(source)) {
        if(!/^\s*(?:object|inherited|inline)\s+(?:\w+\s*:\s*)?Tvx(?:ConfigTemplate|ActionMan|ActionMap|ActionTransport|ActionCustomScript)\b/im.test(block.text))continue;
        if(/\bvelox-cfg="invalid"(?:\s|$)/.test(block.metadata)) {
          if(!/\breason="[^"]+"/.test(block.metadata))report.issues.push({file,line:block.line,code:'invalid-annotation',message:'An invalid CFG example needs a reason.'});
          continue;
        }
        inspect(file,block.text,block.line);
      }
    }
  };
  visit(root);return report;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const args=process.argv.slice(2), option=args.indexOf('--root');
  const root=option>=0?args[option+1]:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
  if(!root)throw new Error('--root requires a directory');
  const report=scanCfgBindings(path.resolve(root));
  if(args.includes('--json'))console.log(JSON.stringify(report,null,2));
  else {
    for(const issue of report.issues)console.error(issue.file+':'+issue.line+' ['+issue.code+'] '+issue.message);
    for(const warning of report.warnings)console.log('NOTE '+warning.file+':'+warning.line+' ['+warning.code+'] '+warning.message);
    console.log('Checked '+report.actions+' action bindings in '+report.flows+' Flows / '+report.fragments+' CFG fragments; errors: '+report.issues.length+', notes: '+report.warnings.length+'.');
    console.log('Static reference checks only; native binding after import, compilation and execution remain separate checks.');
  }
  process.exitCode=report.issues.length?1:0;
}
