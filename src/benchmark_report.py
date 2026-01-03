import time
import random
import sys
import os
import math
from typing import List, Dict, Union

# Setup paths to import from src
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.append(root_dir)

from src.logic_processor import LogicProcessor

class NaiveLogicProcessor:
    """
    Simulates unoptimized, legacy code patterns to serve as a baseline for benchmarking.
    This represents the state of code 'Before' Agentic Optimization.
    """
    
    @staticmethod
    def calculate_risk_score(transactions: List[Dict[str, Union[float, str]]], threshold: float = 1000.0) -> Dict[str, float]:
        """
        O(N*M) implementation of risk scoring where N=users and M=transactions.
        Inefficient nested loops and list lookups.
        """
        final_risk = {}
        unique_users = []
        
        # Inefficient: Find unique users using list lookup O(N^2) worst case
        for tx in transactions:
            uid = tx.get("user_id")
            if uid is not None and uid not in unique_users:
                unique_users.append(uid)
        
        # Inefficient: Iterate through all transactions for every user
        for uid in unique_users:
            total_amount = 0.0
            count = 0
            for tx in transactions:
                if tx.get("user_id") == uid:
                    count += 1
                    try:
                        amt = float(tx.get("amount", 0))
                        if amt > threshold:
                            total_amount += amt
                    except:
                        pass
            
            if count > 0:
                # Same math, just slower loop
                multiplier = math.log(count + 1)
                final_risk[uid] = round(total_amount * multiplier, 2)
                
        return final_risk

    @staticmethod
    def fibonacci_sequence_custom(n: int, alpha: float = 1.0) -> List[float]:
        """
        O(2^N) Recursive implementation.
        Catastrophically slow for N > 30.
        """
        def fib(k):
            if k <= 0: return 0.0
            if k == 1: return 1.0
            return (fib(k-1) + fib(k-2)) * alpha
            
        sequence = []
        for i in range(n):
            sequence.append(fib(i))
        return sequence

def generate_mock_data(num_tx=2000, num_users=100):
    data = []
    for _ in range(num_tx):
        data.append({
            "user_id": f"user_{random.randint(1, num_users)}",
            "amount": random.uniform(10.0, 5000.0),
            "timestamp": "2023-01-01T12:00:00Z"
        })
    return data

def run_benchmark():
    print("Running Agentic SDLC Benchmark...")
    print("Comparing 'Before' (Naive) vs 'After' (Agent Optimized) performance.\n")
    
    results = []
    
    # --- Benchmark 1: Data Processing (Risk Scoring) ---
    N_TX = 5000
    N_USERS = 200
    print(f"[1/2] Benchmarking Transaction Processing (n={N_TX})...")
    transactions = generate_mock_data(N_TX, N_USERS)
    
    # Measure Naive
    start_time = time.time()
    NaiveLogicProcessor.calculate_risk_score(transactions)
    naive_duration = time.time() - start_time
    
    # Measure Optimized
    start_time = time.time()
    LogicProcessor.calculate_risk_score(transactions)
    opt_duration = time.time() - start_time
    
    results.append({
        "Task": "Risk Analysis (O(N) vs O(N^2))",
        "Before": naive_duration,
        "After": opt_duration
    })
    
    # --- Benchmark 2: Algorithmic Computation (Fibonacci) ---
    FIB_N = 32
    print(f"[2/2] Benchmarking Algorithmic Recursion vs Iteration (n={FIB_N})...")
    
    # Measure Naive
    start_time = time.time()
    NaiveLogicProcessor.fibonacci_sequence_custom(FIB_N)
    naive_duration = time.time() - start_time
    
    # Measure Optimized
    start_time = time.time()
    LogicProcessor.fibonacci_sequence_custom(FIB_N)
    opt_duration = time.time() - start_time
    
    results.append({
        "Task": "Sequence Generation (O(N) vs O(2^N))",
        "Before": naive_duration,
        "After": opt_duration
    })
    
    # --- Output Markdown Table ---
    print("\n" + "="*60)
    print("BENCHMARK REPORT")
    print("="*60)
    print("\nCopy the following table into your README.md:\n")
    
    header = "| Metric / Task | Execution Time (Naive) | Execution Time (Agent Optimized) | Speedup Factor |"
    separator = "| :--- | :--- | :--- | :--- |"
    print(header)
    print(separator)
    
    for r in results:
        speedup = r['Before'] / r['After'] if r['After'] > 0 else 0
        print(f"| {r['Task']} | {r['Before']:.4f}s | {r['After']:.4f}s | **{speedup:.1f}x** |")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    run_benchmark()
