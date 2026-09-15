### Example
```Delphi
procedure OnMapEvent(var Value: variant);
begin
  //Read the value of a variable within the Variable Group.  In this example the %s variable group has a variable called 'MyVariable'
  Value := %s['MyVariable'].AsString; 
end;
```

### Usage

This variable group named %s provides access to the variable group variables.


