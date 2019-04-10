# nsi-csv-validator
modulo per validare file csv a partire da un file di regole formato json
#### Formato file di regole:
```
  [ 
    {
      "nome": "nome1",
      "descrizione_regola": "descrizione della regola (mostrata in caso di fallimento validazione)",
      "regola": "regex_per_campo_nome1"
    },
    {
      "nome": "nome2",
      "descrizione_regola": "descrizione della regola (mostrata in caso di fallimento validazione)",
      "regola": "regex_per_campo_nome2"
    },
    ...
    ]
```