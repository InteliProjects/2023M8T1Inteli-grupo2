from lexic.token import Token
from lexic.excepts import LexicalException

class Lexic:

    """"
        A lexical analyzer that processes source code to produce a list of tokens.
    """

    def __init__(self, code):

        """
        Initializes the analyzer with the provided source code.

        Args:
            code (str): The source code to be analyzed.
        """
                
        self.code = code
        self.token_list = []           # List to store the generated tokens
        self.index = 0                 # Current position in the code
        self.current_line = 1          # Current line number in the code
        self.alphabet_list = ["a", "b", "c", "d", "e", "f", "g", "h", "i", # Valid characters for identifiers
                 "j", "k", "l", "m", "n", "o", "p", "q", "r", 
                 "s", "t", "u", "v", "w", "x", "y", "z", "A", 
                 "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                 "K", "L", "M", "N", "O", "P", "Q", "R", "S", 
                 "T", "U", "V", "W", "X", "Y", "Z", "_"]

        self.digit_list = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]  # Valid digits 

        self.reserved_words = {"programa": "PROGRAMA", "se": "SE", "entao": "ENTAO", # Mapping of reserved words/symbols to token names
                  "senao": "SENAO", "enquanto": "ENQUANTO", "faca": "FACA", 
                  "nao": "NAO", "inicio": "LBLOCK", "fim": "RBLOCK", 
                  "verdade": "BOOLEAN", "falso": "BOOLEAN", "ler": "COMANDO", 
                  "ler_varios": "COMANDO", "mostrar": "COMANDO", "tocar": "COMANDO", 
                  "mostrar_tocar": "COMANDO", "esperar": "COMANDO", ":": "COLON", 
                  ",": "COMMA", ".": "DOT", '"': "DQUOTE", "=": "ASSIGN", "(": "LPAR", 
                  ")": "RPAR", "==": "OPREL", "<>": "OPREL", "<": "OPREL", "<=": "OPREL", 
                  ">": "OPREL", ">=": "OPREL", "+": "OPSUM", "-": "OPSUM", "ou": "OPSUM", 
                  "*": "OPMUL", "/": "OPMUL", "%": "OPMUL", "e": "OPMUL", "^": "OPPOW"
                  }
        self.symbol_list = ["+", "-", "*", "/", "^", "%", "(", ")", "<", ">", "=", "<>", "<=", ">=", ":", ";", ",", ".", '"']  # List of valid symbols
    
    def lexic(self):
        """
            Processes the code and generates a list of tokens.
        """
        # Continue processing until the end of the code is reached
        while self.index <= len(self.code):

            # At the end of the code, append an EOF (End Of File) token
            if self.index == len(self.code):
                self.token_list.append(Token("EOF", "EOF", self.current_line))
                break

            # Read the current character
            c = self.code[self.index]
            self.index += 1

            # If it's a newline character, increment the line count
            if c == "\n":
                self.current_line += 1
                continue

            # Skip spaces
            if c == " ":
                continue

            # If the character is a '/', it might be the start of a comment
            if c == "/":
                prev_index = self.index
                self.index = self.comments(c)
                if self.index > prev_index:
                    continue

            # If the character is alphabetic, it might be an identifier or reserved word
            if c in self.alphabet_list:
                self.index = self.starts_alphabetically(c)
                continue

            # If the character is a digit, it's a number
            if c in self.digit_list:
                self.index = self.starts_numerically(c)
                continue

            # If the character is a symbol, process the symbol
            if c in self.symbol_list:
                self.index = self.starts_symbol(c)
                continue

            # If none of the above conditions are met, raise a lexical exception
            raise LexicalException(f"Invalid character on line {self.current_line}: {c}")

            
        

    def starts_alphabetically(self, c):

        """
            Processes a token that starts with an alphabetic character. This could be 
            an identifier or a reserved word.
        """

        tmp =  str(c)
        while self.index <= len(self.code):

            if self.index == len(self.code): 
                if tmp in self.reserved_words:
                    self.token_list.append(Token(self.reserved_words[tmp], tmp, self.current_line))
                    return self.index
                else:
                    self.token_list.append(Token("ID", tmp, self.current_line))
                    return self.index

            if self.code[self.index] in self.alphabet_list or self.code[self.index] in self.digit_list:
                tmp += self.code[self.index]
            else:
                if tmp in self.reserved_words:
                    self.token_list.append(Token(self.reserved_words[tmp], tmp, self.current_line))
                    return self.index
                else:
                    self.token_list.append(Token("ID", tmp, self.current_line))
                    return self.index
            self.index = self.index + 1

        return self.index
    

    def starts_numerically(self, c):

        """
            Processes a token that starts with a numeric character.
        """
                
        tmp = str(c)
        while self.index <= len(self.code):

            if self.index == len(self.code): 
                self.token_list.append(Token("INTEGER", tmp, self.current_line))
                return self.index
            
            if self.code[self.index] in self.digit_list:
                tmp += self.code[self.index]
            else:
                self.token_list.append(Token("INTEGER", tmp, self.current_line))
                return self.index
            self.index = self.index + 1

        
        return self.index


    def starts_symbol(self, c):

        """
            Processes a token that starts with a symbol.
        """
                
        tmp = str(c)

        if self.index == len(self.code):
            self.token_list.append(Token(self.reserved_words[tmp], tmp, self.current_line))
            return self.index

        if (self.index) < len(self.code):
            tmp2 = tmp + self.code[self.index]
            if tmp2 in self.reserved_words:
                self.token_list.append(Token(self.reserved_words[tmp2], tmp2, self.current_line))
                return self.index + 1
            
            else:
                self.token_list.append(Token(self.reserved_words[tmp], tmp, self.current_line))
                if tmp == '"':
                    tmp2 = self.code[self.index]
                    self.index = self.starts_string(tmp2)
                    return self.index
                else:
                    return self.index
            
        return self.index
    
    def starts_string(self, c):

        """
            Processes a token that starts with a double quote, indicating a string.
        """
                
        tmp = str(c)
        self.index = self.index + 1
        while self.index < len(self.code):
            if self.code[self.index] != '"':
                tmp += self.code[self.index]
            else:
                self.token_list.append(Token("STRING", tmp, self.current_line))
                self.token_list.append(Token(self.reserved_words[self.code[self.index]], self.code[self.index], self.current_line))
                return self.index + 1
            self.index = self.index + 1
        
        return self.index 
    
    def comments(self, c):

        """
            Processes comments in the code. Handles both single-line and multi-line comments.
        """
                
        i = self.index
        tmp = str(c)
        if self.code[self.index] == "/":
            while self.code[self.index] != "\n":
                self.index += 1
            self.current_line += 1
            return self.index + 1
        
        if self.code[self.index] == "*":
            self.index += 1
            while self.index < len(self.code):
                if self.code[self.index] == "\n":
                    self.current_line += 1
                elif self.code[self.index] == "*":
                    self.index += 1
                    if self.code[self.index] == "/":
                        self.index += 1
                        return self.index
                self.index += 1
        return i