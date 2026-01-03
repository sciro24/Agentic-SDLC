def calculate_statistics(numbers):
    """
    Calculates mean and standard deviation for a list of numbers.
    Complexity: O(N)
    """
    if not numbers:
        return None
    
    mean = sum(numbers) / len(numbers)
    variance = sum((x - mean) ** 2 for x in numbers) / len(numbers)
    std_dev = variance ** 0.5
    
    return {"mean": mean, "std_dev": std_dev}
