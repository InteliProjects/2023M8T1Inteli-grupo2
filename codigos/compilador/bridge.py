from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from lexic.lexic_analyzer import Lexic
from semantic.semantyc import AnalisadorSemantico
from syntatic.syntatic_analyzer import Syntatic
from syntatic.TreeGenerator import NoFolha, NoInterno


class Compiler:
    @staticmethod
    def compile(code):
        """Compila o código e retorna a tabela de símbolos"""
        lexic_analyzer = Lexic(code)
        lexic_analyzer.lexic()
        syntatic_analyzer = Syntatic(lexic_analyzer.token_list)
        tree = syntatic_analyzer.analyze()
        semantical_analysis = AnalisadorSemantico(tree)
        semantical_analysis.analisar()
        return str(semantical_analysis.tabela)


class Code(BaseModel):
    code: str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
compiler = Compiler()


@app.post("/compile")
async def compile(code: Code):
    try:
        return {"result": compiler.compile(code.code)}
    except Exception as e:
        print(e)
        return {"result": f"O seguinte erro ocorreu: {e}"}
