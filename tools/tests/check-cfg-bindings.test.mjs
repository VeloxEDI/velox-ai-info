import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {checkCfgBindings, parseComponents, scanCfgBindings} from '../check-cfg-bindings.mjs';

// These are generic structural fixtures, not complete native-import packages.
const items=(db='vxDefDB1',file='vxDefFile2')=>[
  'object TvxDefManager',
  '  object '+db+': TvxDefDB',
  "    SourceName = 'Input role'",
  '    SourceType = fstDatabase',
  '  end',
  '  object '+file+': TvxDefFile',
  "    SourceName = 'Output role'",
  '    SourceType = fstFile',
  '  end',
  'end'
].join('\n');
const map=(source='vxDefDB1',dest='vxDefFile2')=>[
  'object vxActionMap1: TvxActionMap',
  '  Source = '+source,
  '  Dest = '+dest,
  'end'
].join('\n');
const flow=(actions=map(),data=items(),name='ExampleProcess')=>
  'object '+name+': TvxActionMan\n'+actions+'\n'+data+'\nend\n';
const has=(result,code)=>result.issues.some(issue=>issue.code===code);

test('resolves forward child references in Map, Transport and Custom Script actions',()=>{
  const source=flow(map()+'\nobject vxActionTransport1: TvxActionTransport\n Source = vxDefFile2\nend\nobject vxActionCustomScript1: TvxActionCustomScript\n Source = vxDefDB1\nend');
  const result=checkCfgBindings(source);
  assert.deepEqual(result.issues,[]); assert.equal(result.actions,3);
});
test('flags missing Map Source and Dest independently, including nil references',()=>{
  assert.ok(has(checkCfgBindings(flow(map().replace('  Source = vxDefDB1\n',''))),'missing-reference'));
  assert.ok(has(checkCfgBindings(flow(map().replace('  Dest = vxDefFile2\n',''))),'missing-reference'));
  assert.ok(has(checkCfgBindings(flow(map('nil'))),'missing-reference'));
});
test('flags unresolved component identifiers',()=>{
  assert.ok(has(checkCfgBindings(flow(map('vxDefDB999'))),'unresolved-reference'));
});
test('rejects quoted labels/module identities rather than treating them as child references',()=>{
  assert.ok(has(checkCfgBindings(flow(map("'Input role'"))),'invalid-reference'));
  assert.ok(has(checkCfgBindings(flow(map("'DefinitionIdentity'"))),'invalid-reference'));
});
test('shared Definition modules are not Flow data items',()=>{
  const source='object SharedDefinition: TvxDBDef\nend\n'+flow(map('SharedDefinition'));
  assert.ok(has(checkCfgBindings(source),'incorrect-class'));
});
test('Transport requires a file data component; Custom Script requires a Definition-backed component',()=>{
  assert.ok(has(checkCfgBindings(flow('object SendStep: TvxActionTransport\n Source = vxDefDB1\nend')),'incorrect-class'));
  assert.ok(has(checkCfgBindings(flow(map()+'\nobject ScriptStep: TvxActionCustomScript\n Source = vxActionMap1\nend')),'incorrect-class'));
  const unrelatedMap="object ExampleMap: TvxMap\n FIDS = 'MapIdentity'\n SourceType = fstDatabase\nend\n";
  assert.ok(has(checkCfgBindings(unrelatedMap+flow("object SendStep: TvxActionTransport\n ActionFIDS = 'MapIdentity'\n Source = vxDefDB1\nend")),'incorrect-class'));
});
test('requires source bindings for Transport and Custom Script too',()=>{
  for(const type of ['TvxActionTransport','TvxActionCustomScript'])
    assert.ok(has(checkCfgBindings(flow('object Step: '+type+'\nend')),'missing-reference'));
});
test('does not resolve a data item in another Flow or an incorrect owning container',()=>{
  const second=flow('object ScriptStep: TvxActionCustomScript\n Source = vxDefDB1\nend',items('vxDefDB8','vxDefFile9'),'SecondProcess');
  assert.ok(has(checkCfgBindings(flow()+second),'incorrect-owner'));
  assert.ok(has(checkCfgBindings(flow(map(),'object vxDefDB1: TvxDefDB\nend\nobject vxDefFile2: TvxDefFile\nend')),'incorrect-owner'));
});
test('duplicate local children are ambiguous, not silently resolved',()=>{
  const result=checkCfgBindings(flow(map(),items()+'\n'+items()));
  assert.ok(has(result,'ambiguous-component')); assert.ok(has(result,'ambiguous-reference'));
});
test('supports separate Flow scopes but warns about package-wide reuse',()=>{
  const result=checkCfgBindings(flow()+flow(map(),items(),'SecondProcess'));
  assert.deepEqual(result.issues,[]); assert.ok(result.warnings.some(item=>item.code==='package-name-reuse'));
});
test('generic component names are a preference note, not proof of unsupported naming',()=>{
  const result=checkCfgBindings(flow(map('InputData','OutputData'),items('InputData','OutputData')));
  assert.deepEqual(result.issues,[]); assert.ok(result.warnings.some(item=>item.code==='naming-preference'));
});
test('checks Map SourceType/DestType when the selected Map metadata is included',()=>{
  // Symbolic module keys are fixture data, not native GUID examples.
  const contract="object ExampleMap: TvxMap\n FIDS = 'MapIdentity'\n SourceType = fstFile\n DestType = fstDatabase\nend\n";
  const attach=action=>action.replace('  Source =',"  ActionFIDS = 'MapIdentity'\n  Source =");
  assert.ok(has(checkCfgBindings(contract+flow(attach(map()))),'incorrect-class'));
  assert.deepEqual(checkCfgBindings(contract+flow(attach(map('vxDefFile2','vxDefDB1')))).issues,[]);
});
test('does not infer a data class from a native-looking component name',()=>{
  const source=flow('object SendStep: TvxActionTransport\n Source = vxDefFile2\nend',items().replace('vxDefFile2: TvxDefFile','vxDefFile2: TvxDefDB'));
  assert.ok(has(checkCfgBindings(source),'incorrect-class'));
});
test('ignores serialized script strings and collection contents while retaining ownership',()=>{
  const script="object ScriptStep: TvxActionCustomScript\n Source = vxDefDB1\n object ScriptItem: TvxScriptItem\n Formula.Strings = (\n 'object Wrong: TvxActionMap'\n 'Source = Wrong'\n 'end')\n Options = <\n item\n Caption = 'end'\n end>\n end\nend";
  assert.deepEqual(checkCfgBindings(flow(script)).issues,[]);
});
test('reports malformed/unclosed structures and supports continued scalar references',()=>{
  assert.ok(has(checkCfgBindings(flow().slice(0,-3)),'parse-error'));
  assert.deepEqual(checkCfgBindings(flow(map().replace('Source = vxDefDB1','Source =\n vxDefDB1'))).issues,[]);
  assert.deepEqual(checkCfgBindings(flow(map().replace('Source = vxDefDB1','Source =\n // continued component reference\n vxDefDB1'))).issues,[]);
});
test('SourceFIDS is not used as a substitute for the action Source component',()=>{
  const source=flow(map().replace('  Source = vxDefDB1',"  SourceFIDS = 'DefinitionIdentity'"));
  assert.ok(has(checkCfgBindings(source),'missing-reference'));
});
test('component and property identifiers are compared without case differences',()=>{
  assert.deepEqual(checkCfgBindings(flow(map('VXDEFDB1','vxdeffile2').replace('Source =','SOURCE ='))).issues,[]);
});
test('invalid CFG examples need a reason and an explicit annotation',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'velox-bindings-invalid-'));
  const marker=String.fromCharCode(96).repeat(3);
  try{
    fs.writeFileSync(path.join(root,'example.md'),marker+'text velox-cfg="invalid"\n'+flow(map('MissingData'))+'\n'+marker);
    assert.ok(scanCfgBindings(root).issues.some(item=>item.code==='invalid-annotation'));
    fs.writeFileSync(path.join(root,'example.md'),marker+'text velox-cfg="invalid" reason="Unresolved-reference negative example; do not copy"\n'+flow(map('MissingData'))+'\n'+marker);
    assert.equal(scanCfgBindings(root).issues.length,0);
  }finally{
    fs.rmSync(path.join(root,'example.md'),{force:true});
    fs.rmdirSync(root);
  }
});
test('CLI rejects generated unresolved references; Markdown examples are checked too',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'velox-bindings-'));
  const cli=fileURLToPath(new URL('../check-cfg-bindings.mjs',import.meta.url));
  const marker=String.fromCharCode(96).repeat(3);
  try{
    fs.writeFileSync(path.join(root,'generated.cfg'),flow(map('MissingData')));
    assert.equal(spawnSync(process.execPath,[cli,'--root',root],{encoding:'utf8'}).status,1);
    fs.writeFileSync(path.join(root,'generated.cfg'),flow());
    fs.writeFileSync(path.join(root,'example.md'),marker+'text\n'+flow(map('MissingData'))+'\n'+marker);
    assert.ok(scanCfgBindings(root).issues.length);
    fs.writeFileSync(path.join(root,'example.md'),marker+'text\n'+flow()+'\n'+marker);
    assert.equal(spawnSync(process.execPath,[cli,'--root',root],{encoding:'utf8'}).status,0);
  }finally{
    fs.rmSync(path.join(root,'generated.cfg'),{force:true});
    fs.rmSync(path.join(root,'example.md'),{force:true});
    fs.rmdirSync(root);
  }
});
