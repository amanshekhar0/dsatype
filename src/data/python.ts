import { AlgorithmSnippet } from '../types';

let _id = 1000;
const pid = () => `py_${_id++}`;

export const pythonAlgorithms: AlgorithmSnippet[] = [
  // ── EASY ──────────────────────────────────────────────────────────────────
  {
    id: pid(),
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Find two indices that add up to target using a hash map.',
    estimatedTime: 35,
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  },
  {
    id: pid(),
    title: 'Binary Search',
    category: 'Arrays',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Search a sorted array in O(log n) using divide and conquer.',
    estimatedTime: 35,
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: pid(),
    title: 'Valid Parentheses',
    category: 'Stacks',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Check if bracket sequence is valid using a stack.',
    estimatedTime: 40,
    code: `def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack[-1] != pairs[char]:
            return False
        else:
            stack.pop()
    return not stack`,
  },
  {
    id: pid(),
    title: 'Maximum Profit (Buy/Sell Stock)',
    category: 'Arrays',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Find the maximum profit from a single buy-sell transaction.',
    estimatedTime: 35,
    code: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
  },
  {
    id: pid(),
    title: 'Palindrome Check',
    category: 'Strings',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Check if a string is a palindrome ignoring case and non-alphanumeric characters.',
    estimatedTime: 25,
    code: `def is_palindrome(s):
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]`,
  },
  {
    id: pid(),
    title: 'Fibonacci with Memoization',
    category: 'DP',
    difficulty: 'Easy',
    language: 'Python',
    description: 'Compute the nth Fibonacci number using top-down DP.',
    estimatedTime: 35,
    code: `def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]`,
  },

  // ── MEDIUM ────────────────────────────────────────────────────────────────
  {
    id: pid(),
    title: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Sort an array using the divide-and-conquer merge sort algorithm.',
    estimatedTime: 75,
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  },
  {
    id: pid(),
    title: 'LRU Cache',
    category: 'Design',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Implement a Least Recently Used cache with O(1) get and put.',
    estimatedTime: 80,
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,
  },
  {
    id: pid(),
    title: 'Number of Islands',
    category: 'Graphs',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Count islands in a 2D grid using depth-first search.',
    estimatedTime: 85,
    code: `def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count`,
  },
  {
    id: pid(),
    title: 'Level Order Traversal (BFS)',
    category: 'Trees',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Traverse a binary tree level by level using a queue.',
    estimatedTime: 90,
    code: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,
  },
  {
    id: pid(),
    title: 'Max Product Subarray',
    category: 'DP',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Find the contiguous subarray with the largest product.',
    estimatedTime: 50,
    code: `def max_product(nums):
    max_prod = min_prod = result = nums[0]
    for num in nums[1:]:
        candidates = (num, max_prod * num, min_prod * num)
        max_prod = max(candidates)
        min_prod = min(candidates)
        result = max(result, max_prod)
    return result`,
  },
  {
    id: pid(),
    title: 'Min Stack',
    category: 'Stacks',
    difficulty: 'Medium',
    language: 'Python',
    description: 'Stack that supports push, pop, top, and getMin in O(1).',
    estimatedTime: 70,
    code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.min_stack[-1]`,
  },

  // ── HARD ──────────────────────────────────────────────────────────────────
  {
    id: pid(),
    title: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'Hard',
    language: 'Python',
    description: 'Sort in-place using the partition-based quick sort algorithm.',
    estimatedTime: 90,
    code: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  },
  {
    id: pid(),
    title: 'Word Break (DP)',
    category: 'DP',
    difficulty: 'Hard',
    language: 'Python',
    description: 'Determine if a string can be segmented into dictionary words.',
    estimatedTime: 55,
    code: `def word_break(s, word_dict):
    word_set = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]`,
  },
  {
    id: pid(),
    title: 'Trapping Rain Water',
    category: 'Arrays',
    difficulty: 'Hard',
    language: 'Python',
    description: 'Compute total water trapped between histogram bars using two pointers.',
    estimatedTime: 70,
    code: `def trap(height):
    if not height:
        return 0
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
  },
  {
    id: pid(),
    title: "Dijkstra's Shortest Path",
    category: 'Graphs',
    difficulty: 'Hard',
    language: 'Python',
    description: "Find shortest paths from a source node using Dijkstra's algorithm with a min-heap.",
    estimatedTime: 90,
    code: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]
    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for neighbor, weight in graph[node].items():
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    return dist`,
  },
  {
    id: pid(),
    title: 'Merge K Sorted Lists',
    category: 'Linked Lists',
    difficulty: 'Hard',
    language: 'Python',
    description: 'Merge k sorted linked lists into one sorted list using a min-heap.',
    estimatedTime: 110,
    code: `import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = curr = ListNode(0)
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`,
  },
];
