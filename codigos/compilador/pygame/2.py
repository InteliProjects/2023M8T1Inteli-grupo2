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

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
        

    screen.fill((0, 0, 0))
    screen.blit(img[2], (300, 200))

    pygame.display.flip()

    time.sleep(1)

    screen.fill((0, 0, 0))

    pygame.display.flip()

    time.sleep(1)

pygame.quit()