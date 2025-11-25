import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const stackAlgorithms: AlgorithmSnippet[] = [
    {
        id: generateId(),
        title: "Next Greater Element (monotonic stack)",
        category: "Stack",
        difficulty: "Easy",
        language: "Java",
        description: "for each element find the next greater element to its right using a monotonic decreasing stack.",
        code: `// next greater element using monotonic stack
public int[] nextGreaterElement(int[] nums){
    int n=nums.length;
    int[] res=new int[n];
    Arrays.fill(res,-1);
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){
        while(!st.isEmpty() && nums[i]>nums[st.peek()]){
            res[st.pop()]=nums[i];
        }
        st.push(i);
    }
    return res;
}`,
        codeCpp: `// next greater element using monotonic stack
vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
    for(int i=0; i<n; i++) {
        while(!st.empty() && nums[i] > nums[st.top()]) {
            res[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Next Smaller Element (monotonic stack)",
        category: "Stack",
        difficulty: "Easy",
        language: "Java",
        description: "for each element find the next smaller element to its right using a monotonic increasing stack.",
        code: `// next smaller element using monotonic stack
public int[] nextSmallerElement(int[] nums){
    int n=nums.length;
    int[] res=new int[n];
    Arrays.fill(res,-1);
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){
        while(!st.isEmpty() && nums[i]<nums[st.peek()]){
            res[st.pop()]=nums[i];
        }
        st.push(i);
    }
    return res;
}`,
        codeCpp: `// next smaller element using monotonic stack
vector<int> nextSmallerElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
    for(int i=0; i<n; i++) {
        while(!st.empty() && nums[i] < nums[st.top()]) {
            res[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Largest Rectangle in Histogram (monotonic stack)",
        category: "Stack",
        difficulty: "Hard",
        language: "Java",
        description: "finds largest rectangle area in histogram using a monotonic increasing stack of indices.",
        code: `// largest rectangle in histogram using monotonic stack
public int largestRectangleArea(int[] heights){
    int n=heights.length;
    Deque<Integer> st=new ArrayDeque<>();
    int maxArea=0;
    for(int i=0;i<=n;i++){
        int h=(i==n?0:heights[i]);
        while(!st.isEmpty() && h<heights[st.peek()]){
            int height=heights[st.pop()];
            int left=st.isEmpty()?0:st.peek()+1;
            int width=i-left;
            maxArea=Math.max(maxArea,height*width);
        }
        st.push(i);
    }
    return maxArea;
}`,
        codeCpp: `// largest rectangle in histogram using monotonic stack
int largestRectangleArea(vector<int>& heights) {
    int n = heights.size();
    stack<int> st;
    int maxArea = 0;
    for(int i=0; i<=n; i++) {
        int h = (i==n ? 0 : heights[i]);
        while(!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()];
            st.pop();
            int left = st.empty() ? 0 : st.top() + 1;
            int width = i - left;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}`
    },
    {
        id: generateId(),
        title: "Trapping Rain Water (stack)",
        category: "Stack",
        difficulty: "Medium",
        language: "Java",
        description: "compute trapped rain water using a stack of indices representing descending heights.",
        code: `// trapping rain water using stack
public int trap(int[] height){
    int n=height.length;
    Deque<Integer> st=new ArrayDeque<>();
    int res=0;
    for(int i=0;i<n;i++){
        while(!st.isEmpty() && height[i]>height[st.peek()]){
            int top=st.pop();
            if(st.isEmpty()) break;
            int distance=i-st.peek()-1;
            int bounded=Math.min(height[i],height[st.peek()])-height[top];
            res+=distance*bounded;
        }
        st.push(i);
    }
    return res;
}`,
        codeCpp: `// trapping rain water using stack
int trap(vector<int>& height) {
    int n = height.size();
    stack<int> st;
    int res = 0;
    for(int i=0; i<n; i++) {
        while(!st.empty() && height[i] > height[st.top()]) {
            int top = st.top();
            st.pop();
            if(st.empty()) break;
            int distance = i - st.top() - 1;
            int bounded = min(height[i], height[st.top()]) - height[top];
            res += distance * bounded;
        }
        st.push(i);
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Evaluate Reverse Polish Notation (stack)",
        category: "Stack",
        difficulty: "Easy",
        language: "Java",
        description: "evaluate an expression in reverse polish notation using a stack.",
        code: `// evaluate reverse polish notation
public int evalRPN(String[] tokens){
    Deque<Integer> st=new ArrayDeque<>();
    for(String t:tokens){
        if("+".equals(t) || "-".equals(t) || "*".equals(t) || "/".equals(t)){
            int b=st.pop();
            int a=st.pop();
            int r=0;
            switch(t){
                case "+": r=a+b; break;
                case "-": r=a-b; break;
                case "*": r=a*b; break;
                default: r=a/b; break;
            }
            st.push(r);
        } else {
            st.push(Integer.parseInt(t));
        }
    }
    return st.pop();
}`,
        codeCpp: `// evaluate reverse polish notation
int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for(string t : tokens) {
        if(t == "+" || t == "-" || t == "*" || t == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if(t == "+") st.push(a + b);
            else if(t == "-") st.push(a - b);
            else if(t == "*") st.push(a * b);
            else st.push(a / b);
        } else {
            st.push(stoi(t));
        }
    }
    return st.top();
}`
    },
    {
        id: generateId(),
        title: "Min Stack (leetcode style)",
        category: "Stack",
        difficulty: "Easy",
        language: "Java",
        description: "stack that supports push,pop,top and retrieving minimum element in constant time.",
        code: `// min stack supporting getMin in o(1)
class MinStack {
    Deque<Integer> st=new ArrayDeque<>();
    Deque<Integer> mins=new ArrayDeque<>();
    public MinStack(){ }
    public void push(int x){
        st.push(x);
        if(mins.isEmpty() || x<=mins.peek()) mins.push(x);
    }
    public void pop(){
        int v=st.pop();
        if(v==mins.peek()) mins.pop();
    }
    public int top(){
        return st.peek();
    }
    public int getMin(){
        return mins.peek();
    }
}`,
        codeCpp: `// min stack supporting getMin in o(1)
class MinStack {
    stack<int> st;
    stack<int> mins;
public:
    MinStack() {}
    void push(int x) {
        st.push(x);
        if(mins.empty() || x <= mins.top()) mins.push(x);
    }
    void pop() {
        if(st.top() == mins.top()) mins.pop();
        st.pop();
    }
    int top() {
        return st.top();
    }
    int getMin() {
        return mins.top();
    }
};`
    },
    {
        id: generateId(),
        title: "Daily Temperatures (next warmer day)",
        category: "Stack",
        difficulty: "Medium",
        language: "Java",
        description: "for each day find how many days until a warmer temperature using monotonic decreasing stack.",
        code: `// daily temperatures using monotonic stack
public int[] dailyTemperatures(int[] T){
    int n=T.length;
    int[] res=new int[n];
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){
        while(!st.isEmpty() && T[i]>T[st.peek()]){
            int idx=st.pop();
            res[idx]=i-idx;
        }
        st.push(i);
    }
    return res;
}`,
        codeCpp: `// daily temperatures using monotonic stack
vector<int> dailyTemperatures(vector<int>& T) {
    int n = T.size();
    vector<int> res(n, 0);
    stack<int> st;
    for(int i=0; i<n; i++) {
        while(!st.empty() && T[i] > T[st.top()]) {
            int idx = st.top();
            st.pop();
            res[idx] = i - idx;
        }
        st.push(i);
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Simplify Path (stack)",
        category: "Stack",
        difficulty: "Easy",
        language: "Java",
        description: "simplify unix-style file path using a stack to handle '.' and '..'.",
        code: `// simplify unix path using stack
public String simplifyPath(String path){
    Deque<String> st=new ArrayDeque<>();
    String[] parts=path.split("/");
    for(String p:parts){
        if(p.isEmpty() || ".".equals(p)) continue;
        if("..".equals(p)){
            if(!st.isEmpty()) st.pop();
        } else {
            st.push(p);
        }
    }
    if(st.isEmpty()) return "/";
    StringBuilder sb=new StringBuilder();
    while(!st.isEmpty()){
        sb.insert(0,"/"+st.pop());
    }
    return sb.toString();
}`,
        codeCpp: `// simplify unix path using stack
string simplifyPath(string path) {
    stack<string> st;
    string res, tmp;
    stringstream ss(path);
    while(getline(ss, tmp, '/')) {
        if(tmp == "" || tmp == ".") continue;
        if(tmp == "..") {
            if(!st.empty()) st.pop();
        } else {
            st.push(tmp);
        }
    }
    while(!st.empty()) {
        res = "/" + st.top() + res;
        st.pop();
    }
    return res.empty() ? "/" : res;
}`
    }
];
