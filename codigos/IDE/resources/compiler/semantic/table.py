import lexic.token as Token 

class NoTabela:
    """
    Classe que representa uma linha da tabela de símbolos da análise semântica.
        - value: um valor qualquer, a depender do que se queira armazenar (None, um ID, um inteiro, um valor booleano, um operador, etc);
        - type: tipo do valor armazenado;
        - kwargs: um conjunto de parâmetros nomeados que serão armazenados como um dicionário (atributo d).
    Dica: é possível construir o analisador semântico sem utilizar o kwargs. Ele está disponível como um facilitador, caso você deseje utilizá-lo.
    Por simplicidade, mantenha os atributos públicos.
    """

    def __init__(self, valor, tipo, **kwargs):
        self.valor = valor
        self.tipo = tipo
        self.d = {}
        for k, v in kwargs.items():
            self.d[k] = v
    
    def get(self, k):
        return self.d.get(k)

    def __repr__(self):
        return f'NoTabela(value={self.valor}, type={self.tipo}, kwargs={self.d})'
    