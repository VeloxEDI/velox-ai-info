import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {forbiddenTokens,checkSource} from '../check-script-failures.mjs';
const fence=(body,metadata='pascal')=>'~~~'+metadata+'\n'+body+'\n~~~\n';

test('flags explicit raises, rethrows, constructors and exception APIs',()=>{
  for(const code of ['raise;', "raise Exception.Create('bad');", "E := Exception.Create('bad');",
    "RaiseException(erCustomError,'bad');",'RaiseLastException;',"RAISE {comment} Exception.Create ('bad');"]) {
    assert.ok(forbiddenTokens(code).length,code);
  }
});
test('allows LogError and exit; ignores Pascal strings/comments',()=>{
  assert.equal(forbiddenTokens("LogError('Do not raise Exception.Create'); Exit;\n// raise;\n{ raise; }\n(* RaiseLastException; *)").length,0);
});
test('does not confuse exception API declarations with calls',()=>{
  assert.equal(forbiddenTokens('procedure RaiseException(Ex: TIFException; Param: string);').length,0);
  assert.equal(forbiddenTokens('procedure RaiseLastException;').length,0);
});
test('extracts Pascal/Delphi Markdown examples in both fence styles',()=>{
  assert.equal(checkSource('example.md',fence('raise;')).issues.length,1);
  const marker=String.fromCharCode(96).repeat(3);
  assert.equal(checkSource('example.md',marker+'Delphi\nraise;\n'+marker+'\n').issues.length,1);
});
test('preserves SQL and explicitly labelled native Delphi',()=>{
  assert.equal(checkSource('example.md',fence("THROW 50000,'bad',1;\nRAISE EXCEPTION 'bad';",'sql')).issues.length,0);
  assert.equal(checkSource('implementation.pas','// velox-role="native-delphi" reason="Native host implementation"\nraise;').issues.length,0);
});
test('reference exemptions require reasons and permitted reference paths',()=>{
  const sample=fence('RaiseLastException;','Delphi velox-role="api-reference" reason="Exception API contract"');
  assert.equal(checkSource('CodeLibrary/Functions/Exceptions/RaiseLastException.md',sample).issues.length,0);
  assert.ok(checkSource('instructions/example.md',sample).issues.length);
  assert.ok(checkSource('example.md',fence('raise;','pascal velox-role="invalid"')).issues.length);
});
test('deliberately invalid patterns are explicitly annotated',()=>{
  const result=checkSource('example.md',fence('raise;','pascal velox-role="invalid" reason="Forbidden pattern; do not copy"'));
  assert.equal(result.issues.length,0); assert.equal(result.exemptions[0].role,'invalid');
});
test('decodes CFG formulas, quoting and split strings before checking',()=>{
  const cfg="OnMapFormula.Strings = (\n 'begin'\n '  ra' +\n 'ise Exception.Create(''bad'');'\n 'end;')";
  const result=checkSource('example.CFG',cfg);
  assert.equal(result.formulas,1);
  assert.ok(result.issues.some(issue=>issue.token.toLowerCase()==='raise'));
  assert.ok(checkSource('example.md',fence(cfg,'text')).issues.length);
  assert.ok(checkSource('example.md',fence(cfg,'Delphi')).issues.length);
});
test('finds unlabelled event scripts and character-code CFG continuations',()=>{
  assert.ok(checkSource('example.md',fence('procedure ScriptEvent; begin raise; end;','text')).issues.length);
  const cfg="Formula.Strings = ('ra' + #105#115 + 'e;')";
  assert.ok(checkSource('example.cfg',cfg).issues.some(issue=>issue.token.toLowerCase()==='raise'));
});
test('does not flag raise in a decoded CFG log message',()=>{
  assert.equal(checkSource('example.cfg',"Formula.Strings = ('LogError(''Never raise an exception.'');' 'Exit;')").issues.length,0);
});
test('does not permit a plain-text fence to hide an explicit raise',()=>{
  assert.ok(checkSource('example.md',fence("raise Exception.Create('bad');",'text')).issues.length);
  assert.ok(checkSource('generated.txt','procedure ScriptEvent; begin raise; end;').issues.length);
});
test('CLI rejects a generated formula then accepts its LogError correction',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'velox-failure-check-'));
  const script=fileURLToPath(new URL('../check-script-failures.mjs',import.meta.url));
  try {
    fs.writeFileSync(path.join(root,'generated.cfg'),"Formula.Strings = ('raise;')");
    assert.equal(spawnSync(process.execPath,[script,'--root',root],{encoding:'utf8'}).status,1);
    fs.writeFileSync(path.join(root,'generated.cfg'),"Formula.Strings = ('LogError(''bad'');' 'Exit;')");
    assert.equal(spawnSync(process.execPath,[script,'--root',root],{encoding:'utf8'}).status,0);
  } finally {
    fs.rmSync(path.join(root,'generated.cfg'),{force:true});
    fs.rmdirSync(root);
  }
});
