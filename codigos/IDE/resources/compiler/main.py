# Python code that receives a file from the terminal process
#
from compiler.compiler import Compiler
import sys

if __name__ == '__main__':
    file = sys.argv[1]
    with open(file, 'r') as f:
        code = f.read()
    compiler = Compiler(code)
    result = compiler.compile()
    print(result)