from semantic.table import NoTabela
from syntatic.TreeGenerator import NoInterno, NoFolha

class SemanticException(Exception):
    pass

class AnalisadorSemantico:
    
    def __init__(self, arvoreSintatica):
        self.arvore = arvoreSintatica
        self.tabela = {}
    
    def analisar(self):
        self.visitarAlg(self.arvore)
    
    def visitarAlg(self, no):
        # print("arvore: " + str(self.arvore))    

        nome_programa = no.get("nome")
        self.tabela[nome_programa] = NoTabela(None, "alg")
        self.visitarBloco(no.get("bloco"))

        # print("Tabela de símbolos:")
        # self.print_tabela()
    
    def visitarBloco(self, bloco):

        # print("bloco: " + str(bloco))

        declaracoes = bloco.get("listaAtribuicao")
        while declaracoes:
            declaracao = declaracoes.get("atribuicao")

            if declaracao.op == "atribuicao":
                id_token = declaracao.get("id")
                if id_token.value not in self.tabela:

                    if declaracao.get("inStatement"): # INPUT
                        in_statement = declaracao.get("inStatement")
                        if in_statement.op == "ler_varios":
                            for i in range(1, 4):
                                self.visitarSumExpression(in_statement.get(f"param{i}"))
                        
                            self.tabela[id_token.value] = NoTabela(None, "BOOLEAN")
                        else:
                            self.tabela[id_token.value] = NoTabela(None, "INTEGER")

                    else:   
                        exp = self.visitarExpression(declaracao.get("expression"))
                        self.tabela[id_token.value] = NoTabela(exp.valor, exp.tipo)
                    
                else:
                    if declaracao.get("inStatement"): # INPUT
                        in_statement = declaracao.get("inStatement")
                        if in_statement.op == "ler_varios":
                            for i in range(1, 4):
                                self.visitarSumExpression(in_statement.get(f"param{i}"))
                    else:
                        exp = self.visitarExpression(declaracao.get("expression"))
                        if self.tabela[id_token.value].tipo != exp.tipo:
                            raise SemanticException(f"Tipos incompatíveis: {id_token.value} e {exp.valor} na linha {id_token.line}")
                        else:
                            self.tabela[id_token.value].valor = exp.valor

            ## ENQUANTO STATEMENT
            elif declaracao.op == "whileStatement":    
                exp = declaracao.get("expression")
                self.visitarExpression(exp)
                faca = declaracao.get("faca")

                if declaracao.get("faca").get("listaAtribuicao") == None:
                    raise SemanticException(f"Loop infinito ")
                
                # print(faca)
                self.visitarBloco(faca)
                # print(block)


            ## SE STATEMENT
            elif declaracao.op == "ifStatement":
                exp = declaracao.get("expression")
                self.visitarExpression(exp)
                entao = declaracao.get("entao")
                self.visitarBloco(entao)
                if declaracao.get("senao"):
                    senao = declaracao.get("senao")
                    self.visitarBloco(senao)

            ## OUTPUT E AWAIT
            elif declaracao.op == "mostrar" or declaracao.op == "tocar" or declaracao.op == "esperar":
                param = declaracao.get("param")
                self.visitarSumExpression(param)

            elif declaracao.op == "mostar_tocar":
                param1 = declaracao.get("param1")
                param2 = declaracao.get("param2")
                self.visitarSumExpression(param1)
                self.visitarSumExpression(param2)
                    
            declaracoes = declaracoes.get("prox")


    
    def visitarExpression(self, noExpression):

        esq_node = noExpression.get("esquerda")

        if noExpression.get("oper"):
            self.visitarSumExpression(esq_node)
            dir_node = noExpression.get("direita")
            resultado = self.visitarSumExpression(dir_node)
            return NoTabela(resultado.valor, "BOOLEAN")
        
        else:
            return self.visitarSumExpression(esq_node)
        

    def visitarSumExpression(self, no):


        if no != None:
            if no.op in ("sumExpression", "multiplicativeTerm", "powerTerm"):
                val1 = self.visitarSumExpression(no.get("esquerda"))
                val2 = self.visitarSumExpression(no.get("direita"))

                if no.get("oper") == "/" and val2.tipo == "INTEGER" and no.get('direita').get('factor'):
                    if no.get('direita').get('factor').value == "0":
                        raise SemanticException(f"Divisão por zero na linha {no.get('direita').get('factor').line}")
                
                if no.get("oper") ==   "^" and val2.tipo == "INTEGER" and no.get('direita').get('sinal') == "-":
                    raise SemanticException(f"Expoente negativo na linha {no.get('direita').get('factor').line}")
                
                if val1 != None:
                    return NoTabela(val1.valor, val1.tipo)
                else:
                    return NoTabela(val2.valor, val2.tipo)

            elif no.op == "factor" and not no.get("expression"):
                factor = no.get("factor")

                if factor.op == "ID":
                    if factor.value not in self.tabela:
                        raise SemanticException(f"O identificador '{factor.value}' na linha {factor.line} não foi declarado")
                    else:
                        return NoTabela(valor=self.tabela[factor.value].valor, tipo=self.tabela[factor.value].tipo)

                elif factor.op == "BOOLEAN":
                    if factor.value == "verdade":
                        return NoTabela(valor=1, tipo="BOOLEAN")
                    else:
                        return NoTabela(valor=0, tipo="BOOLEAN")

                elif factor.op == "INTEGER":
                    sinal = no.get("sinal")

                    if sinal == "-":
                       return NoTabela("-" + factor.value, "INTEGER")
                   
                    else:
                       return NoTabela(factor.value, "INTEGER")


            elif no.op == "factor" and no.get("expression"):
                return self.visitarExpression(no.get("expression"))
            


    def visitarInStatement(self, in_statement):

        if in_statement.op == "ler_varios":
            for i in range(1, 4):
                self.visitarSumExpression(in_statement.get(f"param{i}"))



    def print_tabela(self):
        print(self.tabela)