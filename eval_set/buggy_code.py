def find_prime(n):
    """
    Finds if n is prime.
    """
    # Logic bug: returns True for 1, which is not prime
    if n < 1: 
        return False
    
    # Logic bug: range should go up to sqrt(n) + 1, not n
    for i in range(2, n):
        if n % i == 0:
            return False
            
    return True

def calculate_discount(price, discount_percent):
    # Logic bug: incorrect math order or applying discount
    return price - discount_percent # Should be price * (1 - discount/100)
