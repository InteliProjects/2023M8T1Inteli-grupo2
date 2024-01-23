<program> ::= PROGRAMA DQUOTE STRING DQUOTE COLON <block> DOT
<block> ::= LBLOCK <statement_list> RBLOCK
<statement_list> ::= <statement> <statement_list> | ε
<statement> ::= <assign_statement>
| <if_statement>
| <while_statement>
| <command_statement>

<assign_statement> ::= ID ASSIGN ( <input_statement> | <expression> )

<input_statement> ::= 'ler' LPAR RPAR

| 'ler_varios' LPAR <sum_expression> COMMA <sum_expression> COMMA <sum_expression> RPAR

<if_statement> ::= SE <expression> ENTAO <block> [SENAO <block>]

<while_statement> ::= ENQUANTO <expression> FACA <block>


<command_statement> ::= 'mostrar' LPAR <sum_expression> RPAR

| 'tocar' LPAR <sum_expression> RPAR
| 'esperar' LPAR <sum_expression> RPAR
| 'mostrar_tocar' LPAR <sum_expression> COMMA <sum_expression> RPAR

<expression> ::= <sum_expression> [<relop> <sum_expression>]

<relop> ::= '==' | '<>' | '>' | '<' | '>=' | '<='

<sum_expression> ::= <mult_term> <sum_expression2>

<sum_expression2> ::= ('+' | '-' | 'ou') <mult_term> <sum_expression2>

<mult_term> ::= <power_term> <mult_term2>

<mult_term2> ::= ('*' | '/' | '%' | 'e') <power_term> <mult_term2>

<power_term> ::= <factor> ['^' <power_term>]

<fator> ::= ID
| INTEGER
| <boolean>
| '+' <factor>
| '-' <factor>
| NAO <boolean>
| LPAR <expression> RPAR

<boolean> ::= 'verdade' | 'falso'