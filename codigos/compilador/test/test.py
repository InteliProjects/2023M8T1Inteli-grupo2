import math
import os
import time
import pygame
pygame.init()
pygame.mixer.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption('teste')


img = {}
audio = {}
inputs = {pygame.K_KP_ENTER : 6, pygame.K_SPACE: 2, pygame.K_UP: 4, pygame.K_DOWN: 1, pygame.K_RIGHT: 3, pygame.K_LEFT: 5} 
keys = {6 : pygame.K_KP_ENTER, 2: pygame.K_SPACE, 4: pygame.K_UP, 1: pygame.K_DOWN, 3: pygame.K_RIGHT, 5: pygame.K_LEFT}


def play_audio(audio):
    audio.play()


def show_image(image):
    screen.fill((0, 0, 0))
    screen.blit(image, (300, 200))

    pygame.display.flip()
    time.sleep(1)


def create_audio_map(directory):
    audio_map = {}
    audio_counter = 0
    for filename in os.listdir(directory):
        if filename.endswith('.mp3'):
            audio_map[audio_counter] = pygame.mixer.Sound(f'{directory}/{filename}')
            audio_counter += 1
    return audio_map


def create_image_map(directory):
    img_map = {}
    img_counter = 0
    for filename in os.listdir(directory):
        if filename.endswith('.jpg'):
            img_map[img_counter] = pygame.image.load(f'{directory}/{filename}')
            img_counter += 1
    return img_map


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


img = create_image_map('imgs')
audio = create_audio_map('audios')


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
    press_quadrante_0 = mult_input(1, 1, 0)
    _TEMP_VAR_REL = press_quadrante_0 == True
    if _TEMP_VAR_REL:
        show_image(img[0])
        time.sleep(1)
    else:
        show_image(img[1])
        time.sleep(1)
    pygame.quit()