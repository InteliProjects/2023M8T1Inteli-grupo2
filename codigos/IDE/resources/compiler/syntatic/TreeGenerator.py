import lexic.token as Token 

class SyntaxException(Exception):
	"""
	Define uma classe (vazia) que representa um erro sintático.
	Herda da classe Exception.
	"""
	pass

class NoInterno:
    """
    Classe que representa um nó interno na árvore sintática.
    Recebe como parâmetros:
        - uma string op (operador). Por padrão, use o nome do método que criou o objeto;
        - **kwargs: um conjunto de parâmetros nomeados que serão armazenados como um dicionário (atributo d);
    
    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, op, **kwargs):
        self.op = op
        self.d = {}
        for k, v in kwargs.items():
            self.d[k] = v


    def get(self, k):
        return self.d.get(k)


    def __repr__(self):
        listaParametros = []
        # Os parâmetros nomeados aparecerão sempre ordenados para facilitar a comparação.
        # Desta maneira, a ordem em que eles forem definidos não vai importar:
        # for k in sorted(self.d.keys()):
        for k in self.d.keys():
            valor = self.d[k]
            if type(valor) == str:
                valor = f'"{valor}"'
            listaParametros.append(f"{k}={valor}")
        parametrosStr = ", ".join(listaParametros)
        if len(parametrosStr) > 0:
            parametrosStr = ", " + parametrosStr
        return f'NoInterno(op="{self.op}"{parametrosStr})'
    
    def __str__(self):
        return f'NoInterno(op={self.op}, {self.d})'


class NoFolha:
    """
    Classe que representa um nó folha da árvore sintática.
    Um nó folha pode ser: um TYPE, ID, NUMBER, BOOLEAN.
    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, op, value, line):
        self.op = op
        self.value = value
        self.line = line
    

    def __repr__(self):
        return f'NoFolha(op="{self.op}", value="{self.value}", line={self.line})'
    
    def __str__(self):
        return f'NoFolha({self.op}, {self.value}, line={self.line})'