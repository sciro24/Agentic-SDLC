import math
import re
from typing import List, Dict, Union, Tuple
from collections import defaultdict

class LogicProcessor:
    """
    A class containing complex logic for data processing and risk calculation.
    """

    @staticmethod
    def calculate_risk_score(
        transactions: List[Dict[str, Union[float, str]]], 
        threshold: float = 1000.0
    ) -> Dict[str, float]:
        """
        Calculates a risk score for a list of transactions based on amount and frequency.
        
        Algorithm:
        1. Group transactions by user_id.
        2. For each user:
           - Base score = sum of amounts > threshold.
           - Multiplier = log(number of transactions).
           - Final score = Base score * Multiplier.
        
        Optimization: Using defaultdict streamlines the accumulation loop,
        making the code cleaner and slightly reducing Python loop overhead 
        compared to manual `if key not in dict` checks.
        
        Complexity: O(N) where N is the number of transactions.
        """
        user_scores = defaultdict(float)
        user_counts = defaultdict(int)

        for tx in transactions:
            uid = tx.get("user_id")
            
            # Safely handle potential missing keys or non-numeric amounts
            try:
                amount = float(tx.get("amount", 0))
            except (ValueError, TypeError):
                amount = 0.0
            
            # Only process if user_id is valid
            if uid is not None:
                user_counts[uid] += 1
                if amount > threshold:
                    user_scores[uid] += amount

        final_risk = {}
        for uid, base_score in user_scores.items():
            count = user_counts[uid]
            
            # math.log(x) requires x > 0. Since count must be >= 1 here, log(count + 1) is safe.
            multiplier = math.log(count + 1)
            final_risk[uid] = round(base_score * multiplier, 2)
            
        return final_risk

    @staticmethod
    def parse_complex_log_string(log_string: str) -> List[Tuple[str, str]]:
        """
        Parses a complex log string with nested brackets and extracts key-value pairs.
        Format example: "[TIMESTAMP:2023-10-01][LEVEL:ERROR]{MSG:Connection failed code:500}"
        
        Returns a list of tuples (key, value).
        
        Complexity: O(M) where M is the length of the string.
        """
        # The regex approach is highly efficient for this structured parsing task.
        pattern = re.compile(r'\[(.*?):(.*?)\]|\{(.*?):(.*?)\}')
        matches = pattern.findall(log_string)
        
        # Selects the first non-empty key-value pair based on the regex output structure.
        results = [
            (match[0], match[1]) if match[0] else (match[2], match[3])
            for match in matches
        ]
                
        return results

    @staticmethod
    def fibonacci_sequence_custom(n: int, alpha: float = 1.0) -> List[float]:
        """
        Generates a customized Fibonacci sequence where each term is weighted by alpha.
        F(0) = 0, F(1) = 1
        F(i) = (F(i-1) + F(i-2)) * alpha
        
        Complexity: O(N). This iterative solution is optimal for sequence generation.
        """
        if n <= 0:
            return []
        
        # Initialize the two required predecessor values (F(0), F(1))
        a, b = 0.0, 1.0
        
        if n == 1:
            return [a]
            
        sequence = [a, b]
        
        # Generate the remaining n-2 terms
        for _ in range(2, n):
            next_val = (a + b) * alpha
            rounded_next_val = round(next_val, 4)
            sequence.append(rounded_next_val)
            
            # Efficient state update
            a, b = b, rounded_next_val
            
        return sequence