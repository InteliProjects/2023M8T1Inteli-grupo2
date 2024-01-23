class Token:
    """
    Represents a token in the lexical analysis process.
    """
    
    def __init__(self, type, value, line):
        """
        Initializes a new Token instance.

        Args:
            type (str): The type or category of the token.
            value (str): The actual value or content of the token.
            line (int): The line number where the token appears.
        """
        self.type = type
        self.value = value
        self.line = line

    def __repr__(self):
        """
        Returns a string representation of the token object.
        """
        return f"({self.type} {self.value} {self.line})"
    
    def __eq__(self, other):
        """
        Overrides the equality check to compare tokens based on their type and value.
        
        Args:
            other (Token): Another token instance to compare with.

        Returns:
            bool: True if tokens are equal, False otherwise.
        """
        return self.type == other.type and self.value == other.value
