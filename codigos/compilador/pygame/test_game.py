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
    b = mult_input(a, 3, 5)
    if b:
        show_image(img[2])
        time.sleep(1)
    show_image(img[1])
    time.sleep(1)
    pygame.quit()
