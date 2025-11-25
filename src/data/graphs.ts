import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const graphAlgorithms: AlgorithmSnippet[] = [
    {
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
}`,
        codeCpp: `void dijkstra(vector<vector<int>>& graph, int src) {
    int V = graph.size();
    vector<int> dist(V, INT_MAX);
    vector<bool> sptSet(V, false);
    
    dist[src] = 0;
    
    for (int count = 0; count < V - 1; count++) {
        int min = INT_MAX, u = -1;
        for (int v = 0; v < V; v++)
            if (!sptSet[v] && dist[v] <= min)
                min = dist[v], u = v;
        
        if (u == -1) break;
        sptSet[u] = true;
        
        for (int v = 0; v < V; v++)
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX 
                && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`
    },
    {
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
}`,
        codeCpp: `void topologicalSortUtil(int v, vector<bool>& visited, 
                        stack<int>& Stack, vector<vector<int>>& adj) {
    visited[v] = true;
    for (int i : adj[v])
        if (!visited[i])
            topologicalSortUtil(i, visited, Stack, adj);
    Stack.push(v);
}

void topologicalSort(int V, vector<vector<int>>& adj) {
    stack<int> Stack;
    vector<bool> visited(V, false);
    
    for (int i = 0; i < V; i++)
        if (!visited[i])
            topologicalSortUtil(i, visited, Stack, adj);
            
    while (!Stack.empty()) {
        cout << Stack.top() << " ";
        Stack.pop();
    }
}`
    },
    {
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
}`,
        codeCpp: `void bfs(int s, vector<vector<int>>& adj, vector<bool>& visited) {
    queue<int> q;
    visited[s] = true;
    q.push(s);
    
    while(!q.empty()) {
        s = q.front();
        cout << s << " ";
        q.pop();
        
        for(auto i : adj[s]) {
            if(!visited[i]) {
                visited[i] = true;
                q.push(i);
            }
        }
    }
}`
    },
    {
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
}`,
        codeCpp: `void dfs(int v, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[v] = true;
    cout << v << " ";
    
    for(int i : adj[v]) {
        if(!visited[i])
            dfs(i, adj, visited);
    }
}`
    }
];
