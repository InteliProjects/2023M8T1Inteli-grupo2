# Resultados Geração de código


*Artefato referente a Sprint 5*

# Teste 1

Nome do arquivo: example1.w

Exemplo de código:

```programa "geracao_codigo1":
inicio
a = 5
b = 9
c = (3+a)*b/2
esperar(c)
tocar(a%4)
fim.
``` 

resultado:


import math
import time
import pygame
pygame.init()
pygame.mixer.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption('geracao_codigo1')


img = {1: pygame.image.load('src/pygame/1.jpg'), 2: pygame.image.load('src/pygame/2.jpg') }
audio = {1: pygame.mixer.Sound('src/pygame/1.mp3')}
inputs = {pygame.K_KP_ENTER : 6, pygame.K_SPACE: 2, pygame.K_UP: 4, pygame.K_DOWN: 1, pygame.K_RIGHT: 3, pygame.K_LEFT: 5} 
keys = {6 : pygame.K_KP_ENTER, 2: pygame.K_SPACE, 4: pygame.K_UP, 1: pygame.K_DOWN, 3: pygame.K_RIGHT, 5: pygame.K_LEFT}


def play_audio(audio):
    audio.play()


def show_image(image):
    screen.fill((0, 0, 0))
    screen.blit(image, (300, 200))

    pygame.display.flip()
    time.sleep(1)


def get_input():
    while True:
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key in inputs:
                    return inputs[event.key]


def mult_input(quad, qtd, tol):
        quad_cont = 0
        tol_cont = 0
        while True:
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == keys[quad]:
                        quad_cont += 1
                    else:
                        if tol > 0:
                            tol_cont += 1
                        else:
                            return False
                    if quad_cont == qtd:
                        return True
                    else:
                        if tol_cont == tol:
                            if tol > 0:
                                return False
                            time.sleep(1)


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
    a = 5
    b = 9
    _TEMP_VAR_SUM0 = 3 + a
    _TEMP_VAR_MUL0 = _TEMP_VAR_SUM0 * b
    _TEMP_VAR_MUL1 = _TEMP_VAR_MUL0 / 2
    c = _TEMP_VAR_MUL1
    time.sleep(c)
    _TEMP_VAR_MUL2 = a % 4
    play_audio(audio[_TEMP_VAR_MUL2])
    time.sleep(1)
    pygame.quit()



# Teste 2

Nome do arquivo: example2.w

programa "geracao_codigo2":
inicio
a = ler()
b = ler_varios(4, 3, 1)
se b e (a <> 5) entao
inicio
mostrar(2)
j = 10
enquanto j >= 1 faca
inicio
mostrar_tocar((j*2) % 5, j)
j = j - 1
fim
fim
x = 1 + 2 ^ 3 ^ 5
esperar(x % 20)
fim.


resultado:

import math
import time
import pygame
pygame.init()
pygame.mixer.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption('geracao_codigo2')


img = {1: pygame.image.load('src/pygame/1.jpg'), 2: pygame.image.load('src/pygame/2.jpg') }
audio = {1: pygame.mixer.Sound('src/pygame/1.mp3')}
inputs = {pygame.K_KP_ENTER : 6, pygame.K_SPACE: 2, pygame.K_UP: 4, pygame.K_DOWN: 1, pygame.K_RIGHT: 3, pygame.K_LEFT: 5} 
keys = {6 : pygame.K_KP_ENTER, 2: pygame.K_SPACE, 4: pygame.K_UP, 1: pygame.K_DOWN, 3: pygame.K_RIGHT, 5: pygame.K_LEFT}


def play_audio(audio):
    audio.play()


def show_image(image):
    screen.fill((0, 0, 0))
    screen.blit(image, (300, 200))

    pygame.display.flip()
    time.sleep(1)


def get_input():
    while True:
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                if event.key in inputs:
                    return inputs[event.key]


def mult_input(quad, qtd, tol):
        quad_cont = 0
        tol_cont = 0
        while True:
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == keys[quad]:
                        quad_cont += 1
                    else:
                        if tol > 0:
                            tol_cont += 1
                        else:
                            return False
                    if quad_cont == qtd:
                        return True
                    else:
                        if tol_cont == tol:
                            if tol > 0:
                                return False
                            time.sleep(1)


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
    a = get_input()
    b = mult_input(4, 3, 1)
    _TEMP_VAR_REL = a != 5
    _TEMP_VAR_MUL0 = b and _TEMP_VAR_REL
    if _TEMP_VAR_MUL0:
        show_image(img[2])
        time.sleep(1)
        j = 10
        _TEMP_VAR_REL = j >= 1
        while _TEMP_VAR_REL:
            _TEMP_VAR_MUL1 = j * 2
            _TEMP_VAR_MUL2 = _TEMP_VAR_MUL1 % 5
            show_image(img[_TEMP_VAR_MUL2])
            play_audio(audio[j])
            time.sleep(1)
            _TEMP_VAR_SUM0 = j - 1
            j = _TEMP_VAR_SUM0
    _TEMP_VAR_POW0 = 3 ** 5
    _TEMP_VAR_POW1 = 2 ** _TEMP_VAR_POW0
    _TEMP_VAR_SUM1 = 1 + _TEMP_VAR_POW1
    x = _TEMP_VAR_SUM1
    _TEMP_VAR_MUL3 = x % 20
    time.sleep(_TEMP_VAR_MUL3)
    pygame.quit()

➜  grupo2 gi