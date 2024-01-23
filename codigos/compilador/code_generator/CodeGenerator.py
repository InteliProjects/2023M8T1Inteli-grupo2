import re

class CodeGenerator:

    def __init__(self, tree):
        self.tree = tree
        self.code = ""
        self.indent = - 1
        self.indent_str = "    "
        self.var_sum = 0
        self.var_mul = 0
        self.var_pow = 0
        self.var_minus = 0
        self.var_qtd = 0
        self.imgs = []
        self.audios = []

    
    def generate(self):

        self.initials()
        self.visitarParams()
        self.funcs()
        self.visitarCacheMaps()
        
        self.code += "\n\n"
        self.indent += 1
        self.code += "while True:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}for event in pygame.event.get():\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if event.type == pygame.QUIT:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}pygame.quit()\n"
        self.indent -= 3

        self.visitarBlock(self.tree.get("bloco"))

        self.indent += 1
        self.code += f"{self.indent_str * self.indent}pygame.quit()\n"

        return self.code
    

    def initials(self):
        self.code += "import math\n"
        self.code += "import os\n"
        self.code += "import time\n"
        self.code += "import pygame\n"
        self.code += "pygame.init()\n"
        self.code += "pygame.mixer.init()\n"
        self.code += "width, height = 800, 600\n"
        self.code += "screen = pygame.display.set_mode((width, height))\n"
        self.code += f"pygame.display.set_caption('{self.tree.get('nome')}')\n"
        
    def funcs(self):
        self.play_audio()
        self.show_image()
        self.create_audio_map()
        self.create_image_map()
        self.get_input()
        self.mult_input()


    def play_audio(self):
        self.indent += 1
        self.code += "\n\n"
        self.code += "def play_audio(audio):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}audio.play()\n"
        self.indent -= 1

    def show_image(self):
        self.code += "\n\n"
        self.code += "def show_image(image):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}screen.fill((0, 0, 0))\n"
        self.code += f"{self.indent_str * self.indent}screen.blit(image, (300, 200))\n\n"
        self.code += f"{self.indent_str * self.indent}pygame.display.flip()\n"
        self.code += f"{self.indent_str * self.indent}time.sleep(1)\n"
        self.indent -= 1
        
    def create_image_map(self):
        self.code += "\n\n"
        self.code += "def create_image_map(directory):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}img_map = {{}}\n"
        self.code += f"{self.indent_str * self.indent}img_counter = 0\n"
        self.code += f"{self.indent_str * self.indent}for filename in os.listdir(directory):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if filename.endswith('.jpg'):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}img_map[img_counter] = pygame.image.load(f'{{directory}}/{{filename}}')\n"
        self.code += f"{self.indent_str * self.indent}img_counter += 1\n"
        self.indent -= 2
        self.code += f"{self.indent_str * self.indent}return img_map\n"
        self.indent -= 1
    
    def create_audio_map(self):
        self.code += "\n\n"
        self.code += "def create_audio_map(directory):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}audio_map = {{}}\n"
        self.code += f"{self.indent_str * self.indent}audio_counter = 0\n"
        self.code += f"{self.indent_str * self.indent}for filename in os.listdir(directory):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if filename.endswith('.mp3'):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}audio_map[audio_counter] = pygame.mixer.Sound(f'{{directory}}/{{filename}}')\n"
        self.code += f"{self.indent_str * self.indent}audio_counter += 1\n"
        self.indent -= 2
        self.code += f"{self.indent_str * self.indent}return audio_map\n"
        self.indent -= 1
    
    def get_input(self):
        self.code += "\n\n"
        self.code += "def get_input():\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}while True:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}for event in pygame.event.get():\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if event.type == pygame.KEYDOWN:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if event.key in inputs:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}return inputs[event.key]\n"
        self.indent -= 4


    def mult_input(self):
        self.code += "\n\n"
        self.code += "def mult_input(quad, qtd, tol):\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}quad_cont = 0\n"
        self.code += f"{self.indent_str * self.indent}tol_cont = 0\n"
        self.code += f"{self.indent_str * self.indent}while True:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}for event in pygame.event.get():\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if event.type == pygame.KEYDOWN:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if event.key == keys[quad]:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}quad_cont += 1\n"
        self.indent -= 1
        self.code += f"{self.indent_str * self.indent}else:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if tol > 0:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}tol_cont += 1\n"
        self.indent -= 1
        self.code += f"{self.indent_str * self.indent}else:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}return False\n"
        self.indent -= 2
        self.code += f"{self.indent_str * self.indent}if quad_cont == qtd:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}return True\n"
        self.indent -= 1
        self.code += f"{self.indent_str * self.indent}else:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if tol_cont == tol:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}if tol > 0:\n"
        self.indent += 1
        self.code += f"{self.indent_str * self.indent}return False\n"
        self.indent -= 1
        self.code += f"{self.indent_str * self.indent}time.sleep(1)\n"
        self.indent -= 8

    def visitarParams(self):
        self.indent += 1
        self.code += "\n\n"
        self.code += "img = {}\n"
        self.code += "audio = {}\n"
        self.code += "inputs = {pygame.K_KP_ENTER : 6, pygame.K_SPACE: 2, pygame.K_UP: 4, pygame.K_DOWN: 1, pygame.K_RIGHT: 3, pygame.K_LEFT: 5} \n"
        self.code += "keys = {6 : pygame.K_KP_ENTER, 2: pygame.K_SPACE, 4: pygame.K_UP, 1: pygame.K_DOWN, 3: pygame.K_RIGHT, 5: pygame.K_LEFT}\n"
        self.indent -= 1
    
    def visitarCacheMaps(self):
        self.code += "\n\n"
        self.code += "img = create_image_map('imgs')\n"
        self.code += "audio = create_audio_map('audios')\n"

    def visitarBlock(self, block):
        self.indent += 1

        listaAtribuicao = block.get("listaAtribuicao")

        while listaAtribuicao:
            atribuicao = listaAtribuicao.get("atribuicao")

            if atribuicao.op == "atribuicao":
                id_token = atribuicao.get("id")
                if atribuicao.get("expression"):
                    expression = atribuicao.get("expression")
                    exp = self.visitarExpression(expression)
                    self.code += f"{self.indent_str * self.indent}{id_token.value} = {exp}\n"


                elif atribuicao.get("inStatement"):
                    id_token = atribuicao.get("id")
                    if atribuicao.get("inStatement").op == "ler":
                        self.code += f"{self.indent_str * self.indent}{id_token.value} = get_input()\n"
                    else:
                        print(atribuicao.get("inStatement"))
                        quad = self.visitarSumExpression(atribuicao.get("inStatement").get("param1"))
                        qtd = self.visitarSumExpression(atribuicao.get("inStatement").get("param2"))
                        tol = self.visitarSumExpression(atribuicao.get("inStatement").get("param3"))
                        self.code += f"{self.indent_str * self.indent}{id_token.value} = mult_input({quad}, {qtd}, {tol})\n"


            elif atribuicao.op == "esperar":
                exp_param = self.visitarSumExpression(atribuicao.get("param"))
                self.code += f"{self.indent_str * self.indent}time.sleep({exp_param} / 1000)\n"

            elif atribuicao.op == "mostrar":
                exp = self.visitarSumExpression(atribuicao.get("param"))

                self.code += f'{self.indent_str * self.indent}show_image(img[{exp}])\n'
                self.code += f'{self.indent_str * self.indent}time.sleep(1)\n'


            elif atribuicao.op == "tocar":
                exp = self.visitarSumExpression(atribuicao.get("param"))
                self.code += f"{self.indent_str * self.indent}play_audio(audio[{exp}])\n"
                self.code += f'{self.indent_str * self.indent}time.sleep(1)\n'


            elif atribuicao.op == "mostrar_tocar":
                param1 = self.visitarSumExpression(atribuicao.get("param1"))
                param2 = self.visitarSumExpression(atribuicao.get("param2"))
                self.code += f'{self.indent_str * self.indent}show_image(img[{param1}])\n'
                self.code += f'{self.indent_str * self.indent}play_audio(audio[{param2}])\n'
                self.code += f'{self.indent_str * self.indent}time.sleep(1)\n'

            elif atribuicao.op == "ifStatement":
                exp = self.visitarExpression(atribuicao.get("expression"))
                self.code += f"{self.indent_str * self.indent}if {exp}:\n"
                self.visitarBlock(atribuicao.get("entao"))
                if atribuicao.get("senao"):
                    self.code += f"{self.indent_str * self.indent}else:\n"
                    self.visitarBlock(atribuicao.get("senao"))


            elif atribuicao.op == "whileStatement":
                # print(atribuicao)
                exp = self.visitarExpression(atribuicao.get("expression"))
                self.code += f"{self.indent_str * self.indent}while {exp}:\n"
                self.visitarBlock(atribuicao.get("faca"))


            
            listaAtribuicao = listaAtribuicao.get("prox")

        self.indent -= 1

    def visitarExpression(self, expression):
        E = self.visitarSumExpression(expression.get("esquerda"))

        if expression.get("oper"):
            D = self.visitarSumExpression(expression.get("direita"))
            op = expression.get("oper")
            if op == "<>":
                op = "!="
            self.code += f"{self.indent*self.indent_str}_TEMP_VAR_REL = {E} {op} {D}\n"
            return "_TEMP_VAR_REL"
        else:
            return E
        
    def visitarSumExpression(self, no):
        
        if no:
            val1 = self.visitarSumExpression(no.get("esquerda"))
            val2 = self.visitarSumExpression(no.get("direita"))

            if no.op == "sumExpression":

                if no.get("oper") == "ou":
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_SUM{self.var_sum} = {val1} or {val2}\n"
                    self.var_sum += 1
                    return f"_TEMP_VAR_SUM{self.var_sum - 1}"

                else:
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_SUM{self.var_sum} = {val1} {no.get('oper')} {val2}\n"
                    self.var_sum += 1   
                    return f"_TEMP_VAR_SUM{self.var_sum - 1}"
            

            elif no.op == "multiplicativeTerm":
                    
                # print("oi")

                if no.get("oper") == "e":
                
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_MUL{self.var_mul} = {val1} and {val2}\n"
                    self.var_mul += 1
                    return f"_TEMP_VAR_MUL{self.var_mul - 1}"
                
                else:
                    print()
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_MUL{self.var_mul} = {val1} {no.get('oper')} {val2}\n"
                    self.var_mul += 1
                    return f"_TEMP_VAR_MUL{self.var_mul - 1}"
                
                
            elif no.op == "powerTerm":
                self.code += f"{self.indent*self.indent_str}_TEMP_VAR_POW{self.var_pow} = {val1} ** {val2}\n"
                self.var_pow += 1
                return f"_TEMP_VAR_POW{self.var_pow - 1}"
            

            elif no.op == "factor" and not no.get("expression"):
                factor = no.get("factor")

                if no.get("sinal") == "-":
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_MINUS{self.var_minus} = - {factor.value}\n"
                    self.var_minus += 1
                    return f"_TEMP_VAR_MINUS{self.var_minus - 1}"
                
                else:
                    if factor.value == "verdade":
                        return "True"
                    elif factor.value == "falso":
                        return "False"
                    else:
                        return str(factor.value)
                

            elif no.op == "factor" and no.get("expression"):
                sinal = no.get("sinal")
                if sinal == "-":
                    temp = self.visitarExpression(no.get("expression"))
                    self.code += f"{self.indent*self.indent_str}_TEMP_VAR_MINUS{self.var_minus} = - {temp}\n"
                    self.var_minus += 1
                    return f"_TEMP_VAR_MINUS{self.var_minus - 1}"
                else:
                    return self.visitarExpression(no.get("expression"))