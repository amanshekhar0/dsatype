import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

/**
 * Company-specific DSA questions frequently asked in interviews.
 * Each question is tagged with one or more companies.
 */

export const companyQuestions: AlgorithmSnippet[] = [
  // ═══════════════════════════════════════════════════
  // GOOGLE
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'LRU Cache',
    category: 'Design',
    difficulty: 'Hard',
    language: 'Java',
    description: 'Design a Least Recently Used cache with O(1) get and put. Classic Google/Amazon question.',
    companies: ['Google', 'Amazon', 'Microsoft'],
    code: `// LRU Cache using HashMap + Doubly Linked List
class LRUCache {
    int cap;
    Map<Integer,int[]> map = new HashMap<>();
    int[][] dll; // [prev, key, val, next]
    int head = 0, tail = 0;

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        int[] node = map.get(key);
        moveToFront(node);
        return node[2];
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            int[] node = map.get(key);
            node[2] = value;
            moveToFront(node);
        } else {
            if (map.size() >= cap) evict();
            int[] node = new int[]{0, key, value, 0};
            map.put(key, node);
            addToFront(node);
        }
    }
}`,
    codeCpp: `// LRU Cache using unordered_map + list
class LRUCache {
    int cap;
    list<pair<int,int>> dll;
    unordered_map<int, list<pair<int,int>>::iterator> map;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        if (!map.count(key)) return -1;
        dll.splice(dll.begin(), dll, map[key]);
        return map[key]->second;
    }

    void put(int key, int value) {
        if (map.count(key)) {
            map[key]->second = value;
            dll.splice(dll.begin(), dll, map[key]);
        } else {
            if (map.size() >= cap) {
                map.erase(dll.back().first);
                dll.pop_back();
            }
            dll.emplace_front(key, value);
            map[key] = dll.begin();
        }
    }
};`,
  },
  {
    id: generateId(),
    title: 'Word Ladder (BFS)',
    category: 'Graphs',
    difficulty: 'Hard',
    language: 'Java',
    description: 'Find shortest transformation from beginWord to endWord. Google & Meta favorite.',
    companies: ['Google', 'Meta', 'Amazon'],
    code: `// BFS word ladder - shortest transformation
public int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    if (!dict.contains(end)) return 0;
    Queue<String> q = new LinkedList<>();
    q.add(begin);
    int level = 1;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            char[] word = q.poll().toCharArray();
            for (int j = 0; j < word.length; j++) {
                char orig = word[j];
                for (char c = 'a'; c <= 'z'; c++) {
                    word[j] = c;
                    String next = new String(word);
                    if (next.equals(end)) return level + 1;
                    if (dict.remove(next)) q.add(next);
                }
                word[j] = orig;
            }
        }
        level++;
    }
    return 0;
}`,
  },
  {
    id: generateId(),
    title: 'Median of Two Sorted Arrays',
    category: 'Arrays',
    difficulty: 'Hard',
    language: 'Java',
    description: 'Find median of two sorted arrays in O(log(min(m,n))). Google classic.',
    companies: ['Google', 'Goldman Sachs', 'Apple'],
    code: `// median of two sorted arrays - binary search
public double findMedianSortedArrays(int[] a, int[] b) {
    if (a.length > b.length) return findMedianSortedArrays(b, a);
    int m = a.length, n = b.length;
    int lo = 0, hi = m;
    while (lo <= hi) {
        int i = (lo + hi) / 2;
        int j = (m + n + 1) / 2 - i;
        int maxL1 = i == 0 ? Integer.MIN_VALUE : a[i-1];
        int minR1 = i == m ? Integer.MAX_VALUE : a[i];
        int maxL2 = j == 0 ? Integer.MIN_VALUE : b[j-1];
        int minR2 = j == n ? Integer.MAX_VALUE : b[j];
        if (maxL1 <= minR2 && maxL2 <= minR1) {
            if ((m + n) % 2 == 0)
                return (Math.max(maxL1,maxL2) + Math.min(minR1,minR2)) / 2.0;
            return Math.max(maxL1, maxL2);
        } else if (maxL1 > minR2) hi = i - 1;
        else lo = i + 1;
    }
    return 0;
}`,
  },

  // ═══════════════════════════════════════════════════
  // AMAZON
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Min Stack',
    category: 'Stacks',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Design a stack with O(1) push, pop, top, getMin operations. Amazon classic.',
    companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    code: `// min stack with O(1) getMin
class MinStack {
    Stack<Integer> stack = new Stack<>();
    Stack<Integer> minStack = new Stack<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek())
            minStack.push(val);
    }

    public void pop() {
        if (stack.peek().equals(minStack.peek()))
            minStack.pop();
        stack.pop();
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    codeCpp: `// min stack with O(1) getMin
class MinStack {
    stack<int> st, minSt;
public:
    void push(int val) {
        st.push(val);
        if (minSt.empty() || val <= minSt.top())
            minSt.push(val);
    }
    void pop() {
        if (st.top() == minSt.top()) minSt.pop();
        st.pop();
    }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`,
  },
  {
    id: generateId(),
    title: 'Number of Islands (BFS)',
    category: 'Graphs',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Count connected components in a 2D grid. Amazon & Meta top pick.',
    companies: ['Amazon', 'Meta', 'Microsoft'],
    code: `// number of islands using BFS
public int numIslands(char[][] grid) {
    int count = 0;
    int m = grid.length, n = grid[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                bfs(grid, i, j, m, n);
            }
        }
    }
    return count;
}
void bfs(char[][] grid, int i, int j, int m, int n) {
    Queue<int[]> q = new LinkedList<>();
    q.add(new int[]{i, j});
    grid[i][j] = '0';
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!q.isEmpty()) {
        int[] cell = q.poll();
        for (int[] d : dirs) {
            int r = cell[0]+d[0], c = cell[1]+d[1];
            if (r>=0 && r<m && c>=0 && c<n && grid[r][c]=='1') {
                grid[r][c] = '0';
                q.add(new int[]{r, c});
            }
        }
    }
}`,
  },
  {
    id: generateId(),
    title: 'Valid Parentheses',
    category: 'Stacks',
    difficulty: 'Easy',
    language: 'Java',
    description: 'Check if string of brackets is valid. Amazon/Google/Meta — asked in every round.',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    code: `// valid parentheses using stack
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c)
            return false;
    }
    return stack.isEmpty();
}`,
    codeCpp: `// valid parentheses using stack
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else if (st.empty() || st.top() != c) return false;
        else st.pop();
    }
    return st.empty();
}`,
  },

  // ═══════════════════════════════════════════════════
  // META (Facebook)
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Add Binary Strings',
    category: 'Strings',
    difficulty: 'Easy',
    language: 'Java',
    description: 'Add two binary strings and return their sum. Meta phone screen classic.',
    companies: ['Meta', 'Google'],
    code: `// add two binary strings
public String addBinary(String a, String b) {
    StringBuilder sb = new StringBuilder();
    int i = a.length() - 1, j = b.length() - 1;
    int carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
        int sum = carry;
        if (i >= 0) sum += a.charAt(i--) - '0';
        if (j >= 0) sum += b.charAt(j--) - '0';
        sb.append(sum % 2);
        carry = sum / 2;
    }
    return sb.reverse().toString();
}`,
    codeCpp: `// add two binary strings
string addBinary(string a, string b) {
    string res;
    int i = a.size()-1, j = b.size()-1, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        res += (sum % 2) + '0';
        carry = sum / 2;
    }
    reverse(res.begin(), res.end());
    return res;
}`,
  },
  {
    id: generateId(),
    title: 'Random Pick with Weight',
    category: 'Arrays',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Pick random index proportional to weights. Meta interview staple.',
    companies: ['Meta', 'Google', 'Uber'],
    code: `// random pick with weight using prefix sum + binary search
class Solution {
    int[] prefix;
    Random rand = new Random();

    public Solution(int[] w) {
        prefix = new int[w.length];
        prefix[0] = w[0];
        for (int i = 1; i < w.length; i++)
            prefix[i] = prefix[i-1] + w[i];
    }

    public int pickIndex() {
        int target = rand.nextInt(prefix[prefix.length-1]) + 1;
        int lo = 0, hi = prefix.length - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (prefix[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
  },
  {
    id: generateId(),
    title: 'Lowest Common Ancestor of BST',
    category: 'Trees',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Find LCA of two nodes in a BST. Meta & Amazon frequently ask this.',
    companies: ['Meta', 'Amazon', 'Microsoft'],
    code: `// LCA of BST using BST property
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val)
            root = root.left;
        else if (p.val > root.val && q.val > root.val)
            root = root.right;
        else
            return root;
    }
    return null;
}`,
    codeCpp: `// LCA of BST using BST property
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val)
            root = root->left;
        else if (p->val > root->val && q->val > root->val)
            root = root->right;
        else return root;
    }
    return nullptr;
}`,
  },

  // ═══════════════════════════════════════════════════
  // MICROSOFT
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Reverse Linked List',
    category: 'Linked Lists',
    difficulty: 'Easy',
    language: 'Java',
    description: 'Reverse a singly linked list iteratively. Microsoft/Amazon/Google universal Q.',
    companies: ['Microsoft', 'Amazon', 'Google', 'Apple'],
    code: `// reverse singly linked list iteratively
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    codeCpp: `// reverse singly linked list iteratively
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  },
  {
    id: generateId(),
    title: 'Serialize and Deserialize Binary Tree',
    category: 'Trees',
    difficulty: 'Hard',
    language: 'Java',
    description: 'Convert tree to string and back. Microsoft & Google design question.',
    companies: ['Microsoft', 'Google', 'Amazon'],
    code: `// serialize/deserialize binary tree using preorder
public String serialize(TreeNode root) {
    if (root == null) return "null";
    return root.val + "," + serialize(root.left) + "," + serialize(root.right);
}

public TreeNode deserialize(String data) {
    Queue<String> q = new LinkedList<>(Arrays.asList(data.split(",")));
    return build(q);
}

private TreeNode build(Queue<String> q) {
    String val = q.poll();
    if ("null".equals(val)) return null;
    TreeNode node = new TreeNode(Integer.parseInt(val));
    node.left = build(q);
    node.right = build(q);
    return node;
}`,
  },

  // ═══════════════════════════════════════════════════
  // APPLE
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Maximum Depth of Binary Tree',
    category: 'Trees',
    difficulty: 'Easy',
    language: 'Java',
    description: 'Find max depth of binary tree recursively. Apple & Netflix phone screen.',
    companies: ['Apple', 'Netflix', 'Amazon'],
    code: `// max depth of binary tree using recursion
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    codeCpp: `// max depth of binary tree using recursion
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
  },
  {
    id: generateId(),
    title: 'Longest Substring Without Repeating',
    category: 'Strings',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Sliding window to find longest substring with unique chars. Apple/Amazon/Google.',
    companies: ['Apple', 'Amazon', 'Google', 'Uber'],
    code: `// longest substring without repeating characters
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> map = new HashMap<>();
    int max = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (map.containsKey(c))
            left = Math.max(left, map.get(c) + 1);
        map.put(c, right);
        max = Math.max(max, right - left + 1);
    }
    return max;
}`,
    codeCpp: `// longest substring without repeating characters
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> m;
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.size(); right++) {
        if (m.count(s[right]))
            left = max(left, m[s[right]] + 1);
        m[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },

  // ═══════════════════════════════════════════════════
  // NETFLIX
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Top K Frequent Elements',
    category: 'Arrays',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Find k most frequent elements using bucket sort. Netflix & Amazon.',
    companies: ['Netflix', 'Amazon', 'Google'],
    code: `// top k frequent elements using bucket sort
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    List<Integer>[] buckets = new List[nums.length + 1];
    for (var e : freq.entrySet()) {
        int f = e.getValue();
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(e.getKey());
    }

    int[] res = new int[k];
    int idx = 0;
    for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
        if (buckets[i] != null)
            for (int n : buckets[i]) if (idx < k) res[idx++] = n;
    }
    return res;
}`,
  },

  // ═══════════════════════════════════════════════════
  // GOLDMAN SACHS
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Stock Buy Sell (Max Profit)',
    category: 'Arrays',
    difficulty: 'Easy',
    language: 'Java',
    description: 'Best time to buy and sell stock for max profit. Goldman Sachs & Amazon.',
    companies: ['Goldman Sachs', 'Amazon', 'Microsoft'],
    code: `// best time to buy and sell stock
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) minPrice = price;
        else maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}`,
    codeCpp: `// best time to buy and sell stock
int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX, maxProfit = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        maxProfit = max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
  },
  {
    id: generateId(),
    title: 'Container With Most Water',
    category: 'Arrays',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Find two lines that form container with most water. Goldman/Google.',
    companies: ['Goldman Sachs', 'Google', 'Amazon'],
    code: `// container with most water - two pointers
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        int w = right - left;
        int h = Math.min(height[left], height[right]);
        maxArea = Math.max(maxArea, w * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
    codeCpp: `// container with most water - two pointers
int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxA = 0;
    while (left < right) {
        int w = right - left;
        int h = min(height[left], height[right]);
        maxA = max(maxA, w * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxA;
}`,
  },

  // ═══════════════════════════════════════════════════
  // UBER
  // ═══════════════════════════════════════════════════
  {
    id: generateId(),
    title: 'Group Anagrams',
    category: 'Strings',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Group strings that are anagrams of each other. Uber & Amazon classic.',
    companies: ['Uber', 'Amazon', 'Meta'],
    code: `// group anagrams using sorted key
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,
    codeCpp: `// group anagrams using sorted key
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> m;
    for (auto& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        m[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& [k, v] : m) res.push_back(v);
    return res;
}`,
  },
  {
    id: generateId(),
    title: 'Course Schedule (Topological Sort)',
    category: 'Graphs',
    difficulty: 'Medium',
    language: 'Java',
    description: 'Detect if all courses can be finished (cycle detection). Uber & Google.',
    companies: ['Uber', 'Google', 'Amazon'],
    code: `// course schedule using topological sort (BFS)
public boolean canFinish(int n, int[][] prereqs) {
    int[] inDeg = new int[n];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] p : prereqs) {
        adj.get(p[1]).add(p[0]);
        inDeg[p[0]]++;
    }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++)
        if (inDeg[i] == 0) q.add(i);
    int count = 0;
    while (!q.isEmpty()) {
        int node = q.poll();
        count++;
        for (int next : adj.get(node))
            if (--inDeg[next] == 0) q.add(next);
    }
    return count == n;
}`,
  },
];
