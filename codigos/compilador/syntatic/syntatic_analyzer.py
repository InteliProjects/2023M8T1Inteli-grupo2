from syntatic.TreeGenerator import NoInterno, NoFolha, SyntaxException

class Syntatic:

    """
        This class represents a syntactic analyzer, which takes a sequence of tokens and 
        verifies the sequence's syntactic structure according to QAL's set of grammar rules.
    """

    def __init__(self, tokens):
        """
            Initialize the syntactic analyzer with a list of tokens.

            :param tokens: A list of tokens to be analyzed.
        """
        self.tokens = tokens
        self.index = 0
        self.current_token = self.tokens[self.index]


    def analyze(self):
        """
            Analyze the tokens by parsing them according to the grammar rules.
            The method starts with the 'program' non-terminal symbol and expects an EOF at the end.
        """
        tree = self.program()
        self.match("EOF")
        return tree
        
    def next_token(self):
        """
            Advances to the next token in the token list. If the end of the list is reached,
            the current token is set to None.
        """
        self.index += 1
        if self.index < len(self.tokens):
            self.current_token = self.tokens[self.index]
        else:
            self.current_token = None


    def match(self, expected):
        """
            Validates that the current token matches the expected token type. If it matches,
            the analyzer moves to the next token; otherwise, it raises a syntax error.

            :param expected: A string representing the expected token type.
            :raises Exception: If the current token type does not match the expected type.
        """
        curr_token = self.current_token
        if self.current_token.type == expected:
            self.next_token()
        else:
            raise Exception(f"Syntatic error: expected {expected} line {self.current_token.line}")
        
        return curr_token
    
    def program(self):
        """
            Validates the structure of a QAL program, which includes a program declaration followed by a block of code.
        """
        self.match("PROGRAMA")
        self.match("DQUOTE")
        name = self.match("STRING")
        self.match("DQUOTE")
        self.match("COLON")
        block_node = self.block()
        self.match("DOT")
        return NoInterno(op="programa", nome=name.value, bloco=block_node)


    def block(self):
        """
            Validates a block of code, which is defined by a list of statements enclosed in block delimiters.
        """
        self.match("LBLOCK")
        statement_list_node = self.statement_list()
        self.match("RBLOCK")
        return NoInterno(op="bloco", listaAtribuicao=statement_list_node)


    def statement_list(self):
        """
            Recursively processes a list of statements until the end of the block is reached.
        """
        if self.current_token.type != "RBLOCK":
            statement_node = self.statement()
            next_node = self.statement_list()
            return NoInterno(op="listaAtribuicao", atribuicao=statement_node, prox=next_node)

    def statement(self):
        """
            Determines the type of statement to process based on the current token and delegates to the appropriate method.

            :raises Exception: If an unexpected statement type is encountered.
        """
        if self.current_token.type == "ID":
            return self.assignment_statement()
        elif self.current_token.type == "SE":
            return self.if_statement()
        elif self.current_token.type == "ENQUANTO":
            return self.while_statement()
        elif self.current_token.value in ["mostrar", "tocar", "esperar", "mostrar_tocar"]:
            return self.command_statement()
        else:
            i = self.index - 1
            raise Exception(f"Syntatic error: expected statement line {self.tokens[i].line}")
        
        
    def assignment_statement(self):
        """
            Processes an assignment statement, which assigns a value to a variable.
        """
        id_n = self.match("ID")
        id_node = NoFolha("ID", id_n.value, id_n.line)
        self.match("ASSIGN")
        
        if self.current_token.value in ["ler", "ler_varios"]:
            input_node = self.input_statement()
            return NoInterno(op="atribuicao", id=id_node, inStatement=input_node)
        else:
            expression_node = self.expression()
            return NoInterno(op="atribuicao", id=id_node, expression=expression_node)


    def if_statement(self):
        """
            Processes an if statement, including an optional else block.
        """
        self.match("SE")
        condition_node = self.expression()
        self.match("ENTAO")
        then_block_node = self.block()
        if  self.current_token.type == "SENAO":
            self.match("SENAO")
            else_block_node = self.block()
            return NoInterno(op="ifStatement", expression=condition_node, entao=then_block_node, senao=else_block_node)
        else:
            return NoInterno(op="ifStatement", expression=condition_node, entao=then_block_node)

    def while_statement(self):
        """
            Processes a while statement, which executes a block of code as long as a condition is true.
        """
        self.match("ENQUANTO")
        condition_node = self.expression()
        self.match("FACA")
        block_node = self.block()
        return NoInterno(op="whileStatement", expression=condition_node, faca=block_node)

    def command_statement(self):
        """
            Processes a command statement, which can be a display, wait, play sound command, or a combination of display and play.
        """
        command = self.match("COMANDO")
        self.match("LPAR")
        param1_node = self.sum_expression()
        if command.value == "mostrar_tocar":
            self.match("COMMA")
            param2_node = self.sum_expression()
            self.match("RPAR")
            return NoInterno(op=command.value, param1=param1_node, param2=param2_node)
        else:
            self.match("RPAR")
            return NoInterno(op=command.value, param=param1_node)


    def input_statement(self):
        """
            Processes an input statement, which reads user input.
        """
        command = self.match("COMANDO")
        self.match("LPAR")
        if command.value == "ler_varios":
            param1_node = self.sum_expression()
            self.match("COMMA")
            param2_node = self.sum_expression()
            self.match("COMMA")
            param3_node = self.sum_expression()
            self.match("RPAR")
            return NoInterno(op=command.value, param1=param1_node, param2=param2_node, param3=param3_node)
        else:
            self.match("RPAR")
            return NoInterno(op=command.value)

    
    def expression(self):
        """
            Processes an expression, which can be a mathematical or logical expression.
        """
        esq = self.sum_expression()
        if self.current_token.type == "OPREL":
            op = self.relop()
            right_node = self.sum_expression()
            return NoInterno(op="expression", oper=op.value, esquerda=esq, direita=right_node)
        else:
            return NoInterno(op="expression", oper=None, esquerda=esq, direita=None)


    
    def sum_expression(self):
        """
            Processes a sum expression, which deals with addition and subtraction.
        """
        esq = self.mult_term()
        return self.sum_expression2(esq)

    
    def relop(self):
        """
            Processes a relational operator, which is used to compare two values.
        """
        return self.match("OPREL")

    def sum_expression2(self, esq=None):
        """
            Continues processing a sum expression, allowing for multiple additions or subtractions in sequence.

        """

        if self.current_token.type == "OPSUM":
            token_sum = self.match("OPSUM")
            right = self.mult_term()
            node = NoInterno(op="sumExpression", oper=token_sum.value, esquerda=esq, direita=right)
            return self.sum_expression2(node)
        else:
            return esq

    def mult_term(self):
        """
            Processes a multiplication term within an expression.
        """
        term_node = self.power_term()
        return self.mult_term2(term_node)

    def mult_term2(self, esq=None):
        """
            Continues processing a multiplication term, allowing for multiple multiplications or divisions in sequence.
        """
        if self.current_token.type == "OPMUL":
            opmul = self.match("OPMUL")
            power = self.power_term()
            node = NoInterno(op="multiplicativeTerm", oper=opmul.value, esquerda=esq, direita=power)
            return self.mult_term2(node)
        
        else:
            return esq

    def power_term(self):
        """
            Processes an exponentiation term within an expression.
        """

        factor_node = self.factor()
        if self.current_token.type == "OPPOW":
            oppow = self.match("OPPOW")
            right_node = self.power_term()
            return NoInterno(op="powerTerm", oper=oppow.value, esquerda=factor_node, direita=right_node)
        else:
            return factor_node


    def factor(self, sinal="+"):
        """
            Processes a factor, which can be a number, a variable, or an entire expression enclosed in parentheses.
        """
        if self.current_token.type == "ID":
            token_id = self.match("ID")
            return NoInterno(op="factor", sinal=sinal, esquerda=None, direita=None, factor=NoFolha("ID", token_id.value, token_id.line))
        
        elif self.current_token.type == "INTEGER":
            num = self.match("INTEGER")
            x = NoInterno(op="factor", sinal=sinal, esquerda=None, direita=None, factor=NoFolha("INTEGER", num.value, num.line))
            return x
        
        elif self.current_token.type == "BOOLEAN":
            tokenBool = self.match("BOOLEAN")
            return NoInterno(op="factor", sinal=sinal, esquerda=None, direita=None, factor=NoFolha("BOOLEAN", tokenBool.value, tokenBool.line))
        
        elif self.current_token.value in ["+", "-"]:
            op = self.match("OPSUM")

            return self.factor(op.value)

        elif self.current_token.type == "NAO":
            self.match("NAO")
            right_node = self.match("BOOLEAN")
            return NoInterno(op="NAO", direita=right_node, esquerda=None)
        
        elif self.current_token.type == "LPAR":
            self.match("LPAR")
            node = self.expression()
            self.match("RPAR")
            return NoInterno(op="factor", sinal=sinal, esquerda=None, direita=None, expression=node)
        else:
            i = self.index - 1
            raise Exception(f"Syntatic error: expected factor line {self.tokens[i].line}")
        
        

    # def boolean(self):
    #     """
    #         Processes a boolean value within an expression.
    #     """
    #     node = NoFolha("BOOLEAN", self.current_token.value, self.current_token.line)
    #     self.match("BOOLEAN")
    #     return node