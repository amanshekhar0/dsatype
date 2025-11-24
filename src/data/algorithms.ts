import { AlgorithmSnippet } from '../types';

// Simple UUID generator function
const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
export const algorithmData: AlgorithmSnippet[] = [{
  id: generateId(),
  title: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  code: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
}, {
  id: generateId(),
  title: 'Linear Search',
  category: 'Searching',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple search algorithm that finds the position of a target value within a list by checking each element sequentially.',
  code: `public int linearSearch(int[] arr, int x) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) {
            return i;
        }
    }
    return -1; // Element not found
}`
}, {
  id: generateId(),
  title: 'Binary Search',
  category: 'Searching',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
  code: `public int binarySearch(int[] arr, int x) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        // Check if x is present at mid
        if (arr[mid] == x) {
            return mid;
        }
        
        // If x greater, ignore left half
        if (arr[mid] < x) {
            left = mid + 1;
        } 
        // If x smaller, ignore right half
        else {
            right = mid - 1;
        }
    }
    
    return -1; // Element not found
}`
}, {
  id: generateId(),
  title: 'Selection Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple sorting algorithm that repeatedly selects the smallest element from the unsorted portion and puts it at the beginning.',
  code: `public void selectionSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted array
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        
        // Swap the found minimum element with the first element
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`
}, {
  id: generateId(),
  title: 'Insertion Sort',
  category: 'Sorting',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple sorting algorithm that builds the final sorted array one item at a time, similar to sorting playing cards in your hands.',
  code: `public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        
        /* Move elements of arr[0..i-1], that are
           greater than key, to one position ahead
           of their current position */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
}, {
  id: generateId(),
  title: 'Merge Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  language: 'Java',
  description: 'An efficient, stable, divide-and-conquer sorting algorithm that divides the input array into two halves, recursively sorts them, and then merges them.',
  code: `public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        // Find the middle point
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

public void merge(int[] arr, int left, int mid, int right) {
    // Find sizes of two subarrays to be merged
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temp arrays
    int[] L = new int[n1];
    int[] R = new int[n2];
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; ++i) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; ++j) {
        R[j] = arr[mid + 1 + j];
    }
    
    // Merge the temp arrays
    int i = 0, j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements of L[] if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy remaining elements of R[] if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`
}, {
  id: generateId(),
  title: 'Quick Sort',
  category: 'Sorting',
  difficulty: 'Medium',
  language: 'Java',
  description: "An efficient divide-and-conquer sorting algorithm that selects a 'pivot' element and partitions the array around the pivot.",
  code: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // pi is partitioning index
        int pi = partition(arr, low, high);
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

public int partition(int[] arr, int low, int high) {
    // Select pivot element
    int pivot = arr[high];
    int i = (low - 1); // Index of smaller element
    
    for (int j = low; j < high; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++;
            
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Swap arr[i+1] and arr[high] (or pivot)
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}`
}, {
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
}`
}, {
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
}`
}, {
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
}`
}, {
  id: generateId(),
  title: "Dijkstra's Algorithm",
  category: 'Graph',
  difficulty: 'Hard',
  language: 'Java',
  description: 'A graph search algorithm that solves the single-source shortest path problem for a graph with non-negative edge weights.',
  code: `public void dijkstra(int[][] graph, int src) {
    int V = graph.length;
    int[] dist = new int[V]; // The output array. dist[i] will hold
                             // the shortest distance from src to i
    
    // sptSet[i] will be true if vertex i is included in shortest
    // path tree or shortest distance from src to i is finalized
    boolean[] sptSet = new boolean[V];
    
    // Initialize all distances as INFINITE and sptSet[] as false
    for (int i = 0; i < V; i++) {
        dist[i] = Integer.MAX_VALUE;
        sptSet[i] = false;
    }
    
    // Distance of source vertex from itself is always 0
    dist[src] = 0;
    
    // Find shortest path for all vertices
    for (int count = 0; count < V - 1; count++) {
        // Pick the minimum distance vertex from the set of vertices
        // not yet processed. u is always equal to src in first iteration.
        int u = minDistance(dist, sptSet, V);
        
        // Mark the picked vertex as processed
        sptSet[u] = true;
        
        // Update dist value of the adjacent vertices of the picked vertex.
        for (int v = 0; v < V; v++) {
            // Update dist[v] only if is not in sptSet, there is an
            // edge from u to v, and total weight of path from src to
            // v through u is smaller than current value of dist[v]
            if (!sptSet[v] && graph[u][v] != 0 && 
                dist[u] != Integer.MAX_VALUE && 
                dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
}

public int minDistance(int[] dist, boolean[] sptSet, int V) {
    // Initialize min value
    int min = Integer.MAX_VALUE;
    int minIndex = -1;
    
    for (int v = 0; v < V; v++) {
        if (!sptSet[v] && dist[v] <= min) {
            min = dist[v];
            minIndex = v;
        }
    }
    return minIndex;
}`
}, {
  id: generateId(),
  title: 'Topological Sort',
  category: 'Graph',
  difficulty: 'Hard',
  language: 'Java',
  description: 'A linear ordering of vertices such that for every directed edge (u,v), vertex u comes before v in the ordering.',
  code: `public void topologicalSort(int V, ArrayList<ArrayList<Integer>> adj) {
    Stack<Integer> stack = new Stack<>();
    boolean[] visited = new boolean[V];
    
    // Call the recursive helper function to store
    // Topological Sort starting from all vertices one by one
    for (int i = 0; i < V; i++) {
        if (!visited[i]) {
            topologicalSortUtil(i, visited, stack, adj);
        }
    }
    
    // Print contents of stack
    while (!stack.empty()) {
        System.out.print(stack.pop() + " ");
    }
}

private void topologicalSortUtil(int v, boolean[] visited,
                               Stack<Integer> stack, ArrayList<ArrayList<Integer>> adj) {
    // Mark the current node as visited
    visited[v] = true;
    
    // Recur for all the vertices adjacent to this vertex
    for (Integer neighbor : adj.get(v)) {
        if (!visited[neighbor]) {
            topologicalSortUtil(neighbor, visited, stack, adj);
        }
    }
    
    // Push current vertex to stack which stores result
    stack.push(v);
}`
}, {
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
}`
}, {
  id: generateId(),
  title: 'BFS (Breadth-First Search)',
  category: 'Graph',
  difficulty: 'Medium',
  language: 'Java',
  description: 'A graph traversal algorithm that explores all the vertices of a graph at the present depth prior to moving on to vertices at the next depth level.',
  code: `public void bfs(int s, ArrayList<ArrayList<Integer>> adj, boolean[] visited) {
    // Create a queue for BFS
    LinkedList<Integer> queue = new LinkedList<>();
    
    // Mark the current node as visited and enqueue it
    visited[s] = true;
    queue.add(s);
    
    while (!queue.isEmpty()) {
        // Dequeue a vertex from queue and print it
        s = queue.poll();
        System.out.print(s + " ");
        
        // Get all adjacent vertices of the dequeued vertex s
        // If an adjacent has not been visited, mark it visited
        // and enqueue it
        for (int neighbor : adj.get(s)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.add(neighbor);
            }
        }
    }
}`
}, {
  id: generateId(),
  title: 'DFS (Depth-First Search)',
  category: 'Graph',
  difficulty: 'Medium',
  language: 'Java',
  description: 'A graph traversal algorithm that explores as far as possible along each branch before backtracking.',
  code: `public void dfs(int v, ArrayList<ArrayList<Integer>> adj, boolean[] visited) {
    // Mark the current node as visited and print it
    visited[v] = true;
    System.out.print(v + " ");
    
    // Recur for all the vertices adjacent to this vertex
    for (int neighbor : adj.get(v)) {
        if (!visited[neighbor]) {
            dfs(neighbor, adj, visited);
        }
    }
}`
}, {
  id: generateId(),
  title: 'Queue Implementation',
  category: 'Queue',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple implementation of a Queue data structure using an array.',
  code: `public class Queue {
    private int front, rear, size;
    private int capacity;
    private int[] array;
    
    public Queue(int capacity) {
        this.capacity = capacity;
        front = this.size = 0;
        rear = capacity - 1;
        array = new int[this.capacity];
    }
    
    // Queue is full when size becomes equal to capacity
    boolean isFull() {
        return (this.size == this.capacity);
    }
    
    // Queue is empty when size is 0
    boolean isEmpty() {
        return (this.size == 0);
    }
    
    // Method to add an item to the queue.
    void enqueue(int item) {
        if (isFull()) {
            return;
        }
        this.rear = (this.rear + 1) % this.capacity;
        this.array[this.rear] = item;
        this.size = this.size + 1;
        System.out.println(item + " enqueued to queue");
    }
    
    // Method to remove an item from queue.
    int dequeue() {
        if (isEmpty()) {
            return Integer.MIN_VALUE;
        }
        
        int item = this.array[this.front];
        this.front = (this.front + 1) % this.capacity;
        this.size = this.size - 1;
        return item;
    }
}`
}, {
  id: generateId(),
  title: 'Stack Implementation',
  category: 'Stack',
  difficulty: 'Easy',
  language: 'Java',
  description: 'A simple implementation of a Stack data structure using an array.',
  code: `public class Stack {
    private int top;
    private int maxSize;
    private int[] stackArray;
    
    // Constructor
    public Stack(int size) {
        maxSize = size;
        stackArray = new int[maxSize];
        top = -1; // Initialize top of stack
    }
    
    // Add element to top of stack
    public void push(int value) {
        if (isFull()) {
            System.out.println("Stack is full. Cannot push element.");
            return;
        }
        stackArray[++top] = value;
    }
    
    // Remove element from top of stack
    public int pop() {
        if (isEmpty()) {
            System.out.println("Stack is empty. Cannot pop element.");
            return -1;
        }
        return stackArray[top--];
    }
    
    // Return top of stack
    public int peek() {
        if (isEmpty()) {
            System.out.println("Stack is empty.");
            return -1;
        }
        return stackArray[top];
    }
    
    // Check if stack is empty
    public boolean isEmpty() {
        return (top == -1);
    }
    
    // Check if stack is full
    public boolean isFull() {
        return (top == maxSize - 1);
    }
}`
}];