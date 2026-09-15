### Example
```Delphi
procedure OnMapEvent(var Value: variant);
begin
  //Set the value of this field to the current line number of the map.
  //The LineNo is automatically incremented for each record mapped
  Value := %s.LineNo; 

  {Set the value of this field to the number of records mapped
  Useful to get a count of records processed for EDIFACT files}
  Value := %s.RecordCount;
end;
```

### Description

This variable of %s type provides access to the map object for the dataset record.

It provides access to LineNo and RecordCount properties.
