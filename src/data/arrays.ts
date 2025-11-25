import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const moreArrayAlgorithms: AlgorithmSnippet[] = [
    {
        id: generateId(),
        title: "Maximum Subarray (Kadane's Algorithm)",
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: "finds maximum subarray sum using kadane's algorithm.",
        code: `// kadane's algorithm to find maximum subarray sum
public int maxSubArray(int[] arr){
    int maxSoFar=arr[0],curr=arr[0];
    for(int i=1;i<arr.length;i++){
        curr=Math.max(arr[i],curr+arr[i]);
        maxSoFar=Math.max(maxSoFar,curr);
    }
    return maxSoFar;
}`,
        codeCpp: `// kadane's algorithm to find maximum subarray sum
int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], curr = nums[0];
    for(int i=1; i<nums.size(); i++){
        curr = max(nums[i], curr + nums[i]);
        maxSoFar = max(maxSoFar, curr);
    }
    return maxSoFar;
}`
    },
    {
        id: generateId(),
        title: 'Find Missing Number (1 to n)',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'finds the missing number in array of range 1 to n.',
        code: `// using sum formula to find missing number
public int missingNumber(int[] arr){
    int n=arr.length+1;
    int total=n*(n+1)/2;
    for(int x:arr) total-=x;
    return total;
}`,
        codeCpp: `// using sum formula to find missing number
int missingNumber(vector<int>& nums) {
    int n = nums.size() + 1;
    int total = n * (n + 1) / 2;
    for(int x : nums) total -= x;
    return total;
}`
    },
    {
        id: generateId(),
        title: 'Majority Element (Moore Voting)',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'finds the majority element using moore voting.',
        code: `// moore voting algorithm to find majority element
public int majority(int[] arr){
    int count=0,cand=0;
    for(int x:arr){
        if(count==0){ cand=x; count=1; }
        else if(x==cand) count++;
        else count--;
    }
    return cand;
}`,
        codeCpp: `// moore voting algorithm to find majority element
int majorityElement(vector<int>& nums) {
    int count = 0, cand = 0;
    for(int x : nums) {
        if(count == 0) { cand = x; count = 1; }
        else if(x == cand) count++;
        else count--;
    }
    return cand;
}`
    },
    {
        id: generateId(),
        title: 'Move Zeroes to End',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'shift all zeroes to end while keeping order of non-zero elements.',
        code: `// two pointer approach to move zeroes to end
public void moveZeroes(int[] arr){
    int pos=0;
    for(int i=0;i<arr.length;i++){
        if(arr[i]!=0){
            int t=arr[pos]; arr[pos]=arr[i]; arr[i]=t;
            pos++;
        }
    }
}`,
        codeCpp: `// two pointer approach to move zeroes to end
void moveZeroes(vector<int>& nums) {
    int pos = 0;
    for(int i=0; i<nums.size(); i++) {
        if(nums[i] != 0) {
            swap(nums[pos++], nums[i]);
        }
    }
}`
    },
    {
        id: generateId(),
        title: 'Sort 0s, 1s, 2s (Dutch National Flag)',
        category: 'Arrays',
        difficulty: 'Medium',
        language: 'Java',
        description: 'sorts array of 0s,1s,2s using dutch national flag.',
        code: `// dutch national flag algorithm
public void sortColors(int[] arr){
    int low=0,mid=0,high=arr.length-1;
    while(mid<=high){
        if(arr[mid]==0){
            int t=arr[low]; arr[low]=arr[mid]; arr[mid]=t;
            low++; mid++;
        } else if(arr[mid]==1){
            mid++;
        } else {
            int t=arr[mid]; arr[mid]=arr[high]; arr[high]=t;
            high--;
        }
    }
}`,
        codeCpp: `// dutch national flag algorithm
void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size()-1;
    while(mid <= high) {
        if(nums[mid] == 0) {
            swap(nums[low++], nums[mid++]);
        } else if(nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high--]);
        }
    }
}`
    },
    {
        id: generateId(),
        title: 'Prefix Sum Array',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'creates prefix sum array for fast range queries.',
        code: `// compute prefix sum array
public int[] prefixSum(int[] arr){
    int n=arr.length;
    int[] pref=new int[n];
    pref[0]=arr[0];
    for(int i=1;i<n;i++) pref[i]=pref[i-1]+arr[i];
    return pref;
}`,
        codeCpp: `// compute prefix sum array
vector<int> prefixSum(vector<int>& nums) {
    int n = nums.size();
    vector<int> pref(n);
    pref[0] = nums[0];
    for(int i=1; i<n; i++) pref[i] = pref[i-1] + nums[i];
    return pref;
}`
    },
    {
        id: generateId(),
        title: 'Two Sum (Unsorted)',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'finds two numbers whose sum equals target using hashmap.',
        code: `// two sum using hashmap for unsorted array
public int[] twoSum(int[] arr,int target){
    Map<Integer,Integer> map=new HashMap<>();
    for(int i=0;i<arr.length;i++){
        int need=target-arr[i];
        if(map.containsKey(need)) return new int[]{map.get(need),i};
        map.put(arr[i],i);
    }
    return new int[]{-1,-1};
}`,
        codeCpp: `// two sum using hashmap for unsorted array
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> m;
    for(int i=0; i<nums.size(); i++) {
        int need = target - nums[i];
        if(m.count(need)) return {m[need], i};
        m[nums[i]] = i;
    }
    return {-1, -1};
}`
    },
    {
        id: generateId(),
        title: 'Find Duplicate Number',
        category: 'Arrays',
        difficulty: 'Medium',
        language: 'Java',
        description: 'finds the repeated element using floyd cycle method.',
        code: `// floyd cycle detection to find duplicate
public int findDuplicate(int[] nums){
    int slow=nums[0],fast=nums[0];
    do{
        slow=nums[slow];
        fast=nums[nums[fast]];
    } while(slow!=fast);
    fast=0;
    while(slow!=fast){
        slow=nums[slow];
        fast=nums[fast];
    }
    return slow;
}`,
        codeCpp: `// floyd cycle detection to find duplicate
int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while(slow != fast);
    fast = 0;
    while(slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`
    },
    {
        id: generateId(),
        title: 'Kadane Variant — Maximum Circular Subarray',
        category: 'Arrays',
        difficulty: 'Medium',
        language: 'Java',
        description: 'finds maximum circular subarray sum.',
        code: `// kadane variant for circular array
public int maxCircular(int[] arr){
    int total=0;
    int maxKad=maxSub(arr);
    int minKad=minSub(arr);
    for(int x:arr) total+=x;
    if(minKad==total) return maxKad;
    return Math.max(maxKad,total-minKad);
}
private int maxSub(int[] arr){
    int max=arr[0],curr=arr[0];
    for(int i=1;i<arr.length;i++){
        curr=Math.max(arr[i],curr+arr[i]);
        max=Math.max(max,curr);
    }
    return max;
}
private int minSub(int[] arr){
    int min=arr[0],curr=arr[0];
    for(int i=1;i<arr.length;i++){
        curr=Math.min(arr[i],curr+arr[i]);
        min=Math.min(min,curr);
    }
    return min;
}`,
        codeCpp: `// kadane variant for circular array
int maxCircular(vector<int>& nums) {
    int total = 0, maxSum = nums[0], curMax = 0, minSum = nums[0], curMin = 0;
    for(int x : nums) {
        curMax = max(curMax + x, x);
        maxSum = max(maxSum, curMax);
        curMin = min(curMin + x, x);
        minSum = min(minSum, curMin);
        total += x;
    }
    return maxSum > 0 ? max(maxSum, total - minSum) : maxSum;
}`
    },
    {
        id: generateId(),
        title: 'Rotate Array by K',
        category: 'Arrays',
        difficulty: 'Easy',
        language: 'Java',
        description: 'rotates array to the right by k steps using reverse method.',
        code: `// rotate array by k positions using reverse
public void rotate(int[] arr,int k){
    int n=arr.length; k%=n;
    reverse(arr,0,n-1);
    reverse(arr,0,k-1);
    reverse(arr,k,n-1);
}
private void reverse(int[] arr,int l,int r){
    while(l<r){
        int t=arr[l]; arr[l]=arr[r]; arr[r]=t;
        l++; r--;
    }
}`,
        codeCpp: `// rotate array by k positions using reverse
void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`
    },
    {
        id: generateId(),
        title: "Product of Array Except Self",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "returns product of array except self without using division in o(n).",
        code: `// product of array except self without division
public int[] productExceptSelf(int[] nums){
    int n=nums.length;
    int[] res=new int[n];
    res[0]=1;
    for(int i=1;i<n;i++) res[i]=res[i-1]*nums[i-1];
    int r=1;
    for(int i=n-1;i>=0;i--){
        res[i]*=r;
        r*=nums[i];
    }
    return res;
}`,
        codeCpp: `// product of array except self without division
vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    for(int i=1; i<n; i++) res[i] = res[i-1] * nums[i-1];
    int right = 1;
    for(int i=n-1; i>=0; i--) {
        res[i] *= right;
        right *= nums[i];
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Three Sum (3-sum)",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "finds all unique triplets that sum to zero in an array.",
        code: `// three sum: find unique triplets with sum 0
public List<List<Integer>> threeSum(int[] nums){
    Arrays.sort(nums);
    List<List<Integer>> res=new ArrayList<>();
    for(int i=0;i<nums.length-2;i++){
        if(i>0 && nums[i]==nums[i-1]) continue;
        int l=i+1,r=nums.length-1;
        while(l<r){
            int s=nums[i]+nums[l]+nums[r];
            if(s==0){
                res.add(Arrays.asList(nums[i],nums[l],nums[r]));
                l++; r--;
                while(l<r && nums[l]==nums[l-1]) l++;
                while(l<r && nums[r]==nums[r+1]) r--;
            } else if(s<0) l++;
            else r--;
        }
    }
    return res;
}`,
        codeCpp: `// three sum: find unique triplets with sum 0
vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for(int i=0; i<nums.size()-2; i++) {
        if(i>0 && nums[i]==nums[i-1]) continue;
        int l=i+1, r=nums.size()-1;
        while(l<r) {
            int s = nums[i] + nums[l] + nums[r];
            if(s==0) {
                res.push_back({nums[i], nums[l], nums[r]});
                l++; r--;
                while(l<r && nums[l]==nums[l-1]) l++;
                while(l<r && nums[r]==nums[r+1]) r--;
            } else if(s<0) l++;
            else r--;
        }
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Longest Increasing Subsequence (n log n)",
        category: "Arrays",
        difficulty: "Hard",
        language: "Java",
        description: "computes length of longest increasing subsequence in o(n log n).",
        code: `// lis using patience sorting (n log n)
public int lengthOfLIS(int[] nums){
    if(nums.length==0) return 0;
    int[] tails=new int[nums.length];
    int size=0;
    for(int x:nums){
        int i=Arrays.binarySearch(tails,0,size,x);
        if(i<0) i=-(i+1);
        tails[i]=x;
        if(i==size) size++;
    }
    return size;
}`,
        codeCpp: `// lis using patience sorting (n log n)
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for(int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if(it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`
    },
    {
        id: generateId(),
        title: "Count Inversions",
        category: "Arrays",
        difficulty: "Hard",
        language: "Java",
        description: "counts number of inversions in array using modified merge sort.",
        code: `// count inversions using merge sort
public long countInversions(int[] arr){
    int n=arr.length;
    int[] tmp=new int[n];
    return mergeCount(arr,tmp,0,n-1);
}
private long mergeCount(int[] a,int[] t,int l,int r){
    if(l>=r) return 0;
    int m=(l+r)/2;
    long cnt=mergeCount(a,t,l,m)+mergeCount(a,t,m+1,r);
    int i=l,j=m+1,k=l;
    while(i<=m && j<=r){
        if(a[i]<=a[j]) t[k++]=a[i++];
        else { t[k++]=a[j++]; cnt+= (m-i+1); }
    }
    while(i<=m) t[k++]=a[i++];
    while(j<=r) t[k++]=a[j++];
    for(int p=l;p<=r;p++) a[p]=t[p];
    return cnt;
}`,
        codeCpp: `// count inversions using merge sort
long long mergeCount(vector<int>& a, vector<int>& t, int l, int r) {
    if(l >= r) return 0;
    int m = (l + r) / 2;
    long long cnt = mergeCount(a, t, l, m) + mergeCount(a, t, m+1, r);
    int i = l, j = m + 1, k = l;
    while(i <= m && j <= r) {
        if(a[i] <= a[j]) t[k++] = a[i++];
        else { t[k++] = a[j++]; cnt += (m - i + 1); }
    }
    while(i <= m) t[k++] = a[i++];
    while(j <= r) t[k++] = a[j++];
    for(int p=l; p<=r; p++) a[p] = t[p];
    return cnt;
}
long long countInversions(vector<int>& arr) {
    vector<int> tmp(arr.size());
    return mergeCount(arr, tmp, 0, arr.size()-1);
}`
    },
    {
        id: generateId(),
        title: "Find All Disappeared Numbers",
        category: "Arrays",
        difficulty: "Easy",
        language: "Java",
        description: "finds numbers in range 1..n that do not appear in array using index marking.",
        code: `// find all disappeared numbers using index marking
public List<Integer> findDisappearedNumbers(int[] nums){
    for(int i=0;i<nums.length;i++){
        int idx=Math.abs(nums[i])-1;
        if(nums[idx]>0) nums[idx]*=-1;
    }
    List<Integer> res=new ArrayList<>();
    for(int i=0;i<nums.length;i++) if(nums[i]>0) res.add(i+1);
    return res;
}`,
        codeCpp: `// find all disappeared numbers using index marking
vector<int> findDisappearedNumbers(vector<int>& nums) {
    for(int i=0; i<nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if(nums[idx] > 0) nums[idx] = -nums[idx];
    }
    vector<int> res;
    for(int i=0; i<nums.size(); i++) {
        if(nums[i] > 0) res.push_back(i+1);
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Smallest Subarray With Sum ≥ S",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "finds minimal length subarray with sum at least s using sliding window.",
        code: `// smallest subarray with sum >= s using sliding window
public int minSubArrayLen(int s,int[] nums){
    int n=nums.length,left=0,sum=0,min=Integer.MAX_VALUE;
    for(int right=0;right<n;right++){
        sum+=nums[right];
        while(sum>=s){
            min=Math.min(min,right-left+1);
            sum-=nums[left++];
        }
    }
    return min==Integer.MAX_VALUE?0:min;
}`,
        codeCpp: `// smallest subarray with sum >= s using sliding window
int minSubArrayLen(int s, vector<int>& nums) {
    int n = nums.size(), left = 0, sum = 0, minLen = INT_MAX;
    for(int right=0; right<n; right++) {
        sum += nums[right];
        while(sum >= s) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}`
    },
    {
        id: generateId(),
        title: "Merge Intervals",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "merges overlapping intervals and returns merged list.",
        code: `// merge overlapping intervals
public int[][] merge(int[][] intervals){
    if(intervals.length==0) return new int[0][];
    Arrays.sort(intervals,(a,b)->a[0]-b[0]);
    List<int[]> res=new ArrayList<>();
    int[] cur=intervals[0];
    for(int i=1;i<intervals.length;i++){
        if(intervals[i][0]<=cur[1]) cur[1]=Math.max(cur[1],intervals[i][1]);
        else { res.add(cur); cur=intervals[i]; }
    }
    res.add(cur);
    return res.toArray(new int[res.size()][]);
}`,
        codeCpp: `// merge overlapping intervals
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if(intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res;
    res.push_back(intervals[0]);
    for(int i=1; i<intervals.size(); i++) {
        if(intervals[i][0] <= res.back()[1]) {
            res.back()[1] = max(res.back()[1], intervals[i][1]);
        } else {
            res.push_back(intervals[i]);
        }
    }
    return res;
}`
    },
    {
        id: generateId(),
        title: "Longest Consecutive Sequence",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "finds length of longest sequence of consecutive integers using set.",
        code: `// longest consecutive sequence using hash set
public int longestConsecutive(int[] nums){
    Set<Integer> s=new HashSet<>();
    for(int x:nums) s.add(x);
    int best=0;
    for(int x:nums){
        if(!s.contains(x-1)){
            int cur=x, cnt=1;
            while(s.contains(cur+1)){ cur++; cnt++; }
            best=Math.max(best,cnt);
        }
    }
    return best;
}`,
        codeCpp: `// longest consecutive sequence using hash set
int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int best = 0;
    for(int x : nums) {
        if(!s.count(x-1)) {
            int cur = x, cnt = 1;
            while(s.count(cur+1)) { cur++; cnt++; }
            best = max(best, cnt);
        }
    }
    return best;
}`
    },
    {
        id: generateId(),
        title: "Subarray Sum Equals K",
        category: "Arrays",
        difficulty: "Medium",
        language: "Java",
        description: "counts subarrays summing to k using prefix sum hashmap in o(n).",
        code: `// count subarrays with sum equal k using hashmap
public int subarraySum(int[] nums,int k){
    Map<Integer,Integer> map=new HashMap<>();
    map.put(0,1);
    int sum=0,count=0;
    for(int x:nums){
        sum+=x;
        if(map.containsKey(sum-k)) count+=map.get(sum-k);
        map.put(sum,map.getOrDefault(sum,0)+1);
    }
    return count;
}`,
        codeCpp: `// count subarrays with sum equal k using hashmap
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> m;
    m[0] = 1;
    int sum = 0, count = 0;
    for(int x : nums) {
        sum += x;
        if(m.count(sum-k)) count += m[sum-k];
        m[sum]++;
    }
    return count;
}`
    },
    {
        id: generateId(),
        title: "Peak Element",
        category: "Arrays",
        difficulty: "Easy",
        language: "Java",
        description: "finds an index of a peak element where element > neighbors using binary search.",
        code: `// find peak element index using binary search
public int findPeakElement(int[] nums){
    int l=0,r=nums.length-1;
    while(l<r){
        int m=(l+r)/2;
        if(nums[m]>nums[m+1]) r=m;
        else l=m+1;
    }
    return l;
}`,
        codeCpp: `// find peak element index using binary search
int findPeakElement(vector<int>& nums) {
    int l = 0, r = nums.size() - 1;
    while(l < r) {
        int m = (l + r) / 2;
        if(nums[m] > nums[m+1]) r = m;
        else l = m + 1;
    }
    return l;
}`
    }
];
