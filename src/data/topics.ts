export interface TopicData {
  id: string;
  title: string;
  definition: string;
  timeComplexity: string;
  spaceComplexity: string;
  interviewQuestions: string[];
  practiceCategory: string; // Map this to an AlgorithmContext category like 'Arrays', 'Graphs'
}

export const topicsData: TopicData[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    definition: 'Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1) for iterative, O(log n) for recursive',
    interviewQuestions: [
      'Find First and Last Position of Element in Sorted Array',
      'Search in Rotated Sorted Array',
      'Find Minimum in Rotated Sorted Array',
      'Search a 2D Matrix',
      'Koko Eating Bananas'
    ],
    practiceCategory: 'Arrays'
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    definition: 'A Linked List is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers.',
    timeComplexity: 'O(n) for search/access, O(1) for insert/delete at known pointer',
    spaceComplexity: 'O(n)',
    interviewQuestions: [
      'Reverse Linked List',
      'Merge Two Sorted Lists',
      'Linked List Cycle',
      'Remove Nth Node From End of List',
      'Copy List with Random Pointer'
    ],
    practiceCategory: 'General' // We will fallback to general or create one if missing
  },
  {
    id: 'hash-table',
    title: 'Hash Table',
    definition: 'A Hash Table is a data structure which stores data in an associative manner. In a hash table, data is stored in an array format, where each data value has its own unique index value. Access of data becomes very fast if we know the index of the desired data.',
    timeComplexity: 'O(1) average for search/insert/delete, O(n) worst case',
    spaceComplexity: 'O(n)',
    interviewQuestions: [
      'Two Sum',
      'Valid Anagram',
      'Group Anagrams',
      'Top K Frequent Elements',
      'Longest Consecutive Sequence'
    ],
    practiceCategory: 'General'
  },
  {
    id: 'dfs',
    title: 'Depth-First Search (DFS)',
    definition: 'Depth-First Search is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
    timeComplexity: 'O(V + E) where V is vertices and E is edges',
    spaceComplexity: 'O(V)',
    interviewQuestions: [
      'Number of Islands',
      'Max Area of Island',
      'Clone Graph',
      'Course Schedule',
      'Word Search'
    ],
    practiceCategory: 'Graphs'
  },
  {
    id: 'bfs',
    title: 'Breadth-First Search (BFS)',
    definition: 'Breadth-First Search is an algorithm for searching a tree data structure for a node that satisfies a given property. It starts at the tree root and explores all nodes at the present depth prior to moving on to the nodes at the next depth level.',
    timeComplexity: 'O(V + E) where V is vertices and E is edges',
    spaceComplexity: 'O(V)',
    interviewQuestions: [
      'Binary Tree Level Order Traversal',
      'Rotting Oranges',
      'Shortest Path in Binary Matrix',
      'Word Ladder',
      'Populating Next Right Pointers in Each Node'
    ],
    practiceCategory: 'Graphs'
  }
];
