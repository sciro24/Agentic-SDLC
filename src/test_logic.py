import unittest
from logic_processor import LogicProcessor

class TestLogicProcessor(unittest.TestCase):
    
    def test_calculate_risk_score(self):
        transactions = [
            {"user_id": "u1", "amount": 1200},
            {"user_id": "u1", "amount": 500},
            {"user_id": "u2", "amount": 2000},
        ]
        # u1: base = 1200, count = 2 -> 1200 * log(3) approx 1200 * 1.098 = 1318.33
        # u2: base = 2000, count = 1 -> 2000 * log(2) approx 2000 * 0.693 = 1386.29
        
        result = LogicProcessor.calculate_risk_score(transactions, threshold=1000)
        self.assertTrue("u1" in result)
        self.assertTrue("u2" in result)
        self.assertGreater(result["u1"], 1000)

    def test_parse_complex_log_string(self):
        log = "[TIMESTAMP:2023][LEVEL:INFO]{MSG:Hello}"
        parsed = LogicProcessor.parse_complex_log_string(log)
        expected = [('TIMESTAMP', '2023'), ('LEVEL', 'INFO'), ('MSG', 'Hello')]
        self.assertEqual(parsed, expected)

    def test_fibonacci_custom(self):
        # alpha=1 is standard fib
        seq = LogicProcessor.fibonacci_sequence_custom(5, alpha=1.0)
        self.assertEqual(seq, [0.0, 1.0, 1.0, 2.0, 3.0])
        
        # alpha=2
        # F2 = (1+0)*2 = 2
        # F3 = (2+1)*2 = 6
        # F4 = (6+2)*2 = 16
        seq2 = LogicProcessor.fibonacci_sequence_custom(5, alpha=2.0)
        self.assertEqual(seq2, [0.0, 1.0, 2.0, 6.0, 16.0])

if __name__ == '__main__':
    unittest.main()
