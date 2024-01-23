programa "exemplo1":
inicio
      qtd = 1
      resp = ler_varios(10, qtd, 1)
      i = 30
      x = 1
      enquanto (i >= 1) ou (resp) faca inicio
            se x > 20 entao inicio
                  x = 1
            fim senao inicio
                  x = x + 1
            fim
            mostrar(x)
            qtd = qtd + 1
            resp = ler_varios(10, qtd, 1)
            i = i - 1
      fim
fim.