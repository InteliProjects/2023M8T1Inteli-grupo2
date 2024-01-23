from compiler.compiler import Compiler
from semantic.semantyc import AnalisadorSemantico
from syntatic.TreeGenerator import NoInterno, NoFolha

import sys

from compiler.compiler import Compiler
from semantic.semantyc import AnalisadorSemantico
from syntatic.TreeGenerator import NoFolha, NoInterno

# Read the code from the file passed as argument
with open(f"{sys.argv[1]}", "r") as file:
    code = file.read()

analyser = Compiler(code)
analyser.compile()

### Para rodar o compilador, execute o comando abaixo no terminal:
### python3 src/main.py <nome do arquivo>

