from typing import List

def find_duplicates(items: List[int]) -> List[int]:
    """
    Finds duplicate items in a list.
    Performance: Very Poor.
    """
    duplicates = []
    # Inefficient O(N^2) complexity
    for i in range(len(items)):
        for j in range(len(items)):
            if i != j and items[i] == items[j]:
                if items[i] not in duplicates: # Another O(N) linear search
                    duplicates.append(items[i])
    return duplicates
