from lexic.lexic_analyzer import Lexic
from syntatic.syntatic_analyzer import Syntatic
from syntatic.TreeGenerator import NoInterno, NoFolha
from semantic.semantyc import AnalisadorSemantico
from code_generator.CodeGenerator import CodeGenerator


class Compiler:


    def __init__(self, code):
        self.code = code
        self.tokens = []

    def compile(self):
        lexic_analyzer = Lexic(self.code)
        lexic_analyzer.lexic()
        syntatic_analyzer = Syntatic(lexic_analyzer.token_list)
        tree = syntatic_analyzer.analyze()
        # self.print_tree(tree)  # linha comentada
        analiseSemantica = AnalisadorSemantico(tree)
        analiseSemantica.analisar()
        # print(analiseSemantica.tabela)  # imprime apenas a tabela de símbolos
        generator = CodeGenerator(tree)
        print(generator.generate())
        # print(generator.generate())  # imprime o código gerado

