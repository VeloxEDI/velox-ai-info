### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  //Loop the dataset and read the value of a field from the dataset
  while not %s.Eof do
  begin
    if %s['FieldName'].Value = 'ABC' then
      LogInfo('The fields value is equal to ABC');
    %s.Next;
  end;	  
end;
```

### Description

This variable of %s type provides access to the source dataset so you can read the records and field data.
