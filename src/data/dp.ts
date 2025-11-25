import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const dpAlgorithms: AlgorithmSnippet[] = [
    {
        id: generateId(),
        title: "Kadane's Algorithm",
        category: 'DP',
        difficulty: 'Medium',
        language: 'Java',
        description: 'An efficient algorithm for finding the maximum sum subarray in a one-dimensional array, using dynamic programming.',
        code: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        // Either add the current element to the previous subarray
        // or start a new subarray from the current element
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        
        // Update max sum found so far
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`,
        codeCpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`
    },
    {
        id: generateId(),
        title: 'Fibonacci (Recursive)',
        category: 'DP',
        difficulty: 'Easy',
        language: 'Java',
        description: 'A recursive implementation to calculate the nth Fibonacci number, where each number is the sum of the two preceding ones.',
        code: `public int fibonacci(int n) {
    // Base cases
    if (n <= 1) {
        return n;
    }
    
    // Recursive call
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        codeCpp: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
    },
    {
        id: generateId(),
        title: 'Fibonacci (Dynamic Programming)',
        category: 'DP',
        difficulty: 'Medium',
        language: 'Java',
        description: 'An efficient dynamic programming approach to calculate the nth Fibonacci number, avoiding redundant calculations.',
        code: `public int fibonacciDP(int n) {
    // Base cases
    if (n <= 1) {
        return n;
    }
    
    // Create an array to store Fibonacci numbers
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill dp array in bottom-up manner
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`,
        codeCpp: `int fibonacciDP(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}`
    },
    {
        id: generateId(),
        title: 'Longest Increasing Subsequence',
        category: 'DP',
        difficulty: 'Hard',
        language: 'Java',
        description: 'A classic dynamic programming problem to find the length of the longest subsequence of a given sequence such that all elements are in increasing order.',
        code: `public int lengthOfLIS(int[] nums) {
    if (nums.length == 0) {
        return 0;
    }
    
    int[] dp = new int[nums.length];
    dp[0] = 1;
    int maxLength = 1;
    
    for (int i = 1; i < nums.length; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}`,
        codeCpp: `int lengthOfLIS(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    vector<int> dp(nums.size(), 1);
    int maxLength = 1;
    
    for (int i = 1; i < nums.size(); i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLength = max(maxLength, dp[i]);
    }
    
    return maxLength;
}`
    }
];
