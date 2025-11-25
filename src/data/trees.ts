import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const treeAlgorithms: AlgorithmSnippet[] = [
    {
        id: generateId(),
        title: 'Inorder Traversal',
        category: 'Binary Tree',
        difficulty: 'Easy',
        language: 'Java',
        description: 'Traverse a binary tree in inorder (Left, Root, Right).',
        code: `public void inorderTraversal(TreeNode root) {
    if (root == null) return;
    
    inorderTraversal(root.left);
    System.out.print(root.val + " ");
    inorderTraversal(root.right);
}`,
        codeCpp: `void inorderTraversal(TreeNode* root) {
    if (root == NULL) return;
    
    inorderTraversal(root->left);
    cout << root->val << " ";
    inorderTraversal(root->right);
}`
    },
    {
        id: generateId(),
        title: 'Preorder Traversal',
        category: 'Binary Tree',
        difficulty: 'Easy',
        language: 'Java',
        description: 'Traverse a binary tree in preorder (Root, Left, Right).',
        code: `public void preorderTraversal(TreeNode root) {
    if (root == null) return;
    
    System.out.print(root.val + " ");
    preorderTraversal(root.left);
    preorderTraversal(root.right);
}`,
        codeCpp: `void preorderTraversal(TreeNode* root) {
    if (root == NULL) return;
    
    cout << root->val << " ";
    preorderTraversal(root->left);
    preorderTraversal(root->right);
}`
    },
    {
        id: generateId(),
        title: 'Postorder Traversal',
        category: 'Binary Tree',
        difficulty: 'Easy',
        language: 'Java',
        description: 'Traverse a binary tree in postorder (Left, Right, Root).',
        code: `public void postorderTraversal(TreeNode root) {
    if (root == null) return;
    
    postorderTraversal(root.left);
    postorderTraversal(root.right);
    System.out.print(root.val + " ");
}`,
        codeCpp: `void postorderTraversal(TreeNode* root) {
    if (root == NULL) return;
    
    postorderTraversal(root->left);
    postorderTraversal(root->right);
    cout << root->val << " ";
}`
    },
    {
        id: generateId(),
        title: 'Level Order Traversal',
        category: 'Binary Tree',
        difficulty: 'Medium',
        language: 'Java',
        description: 'Traverse a binary tree level by level (Breadth-First Search).',
        code: `public void levelOrder(TreeNode root) {
    if (root == null) return;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    
    while (!queue.isEmpty()) {
        TreeNode tempNode = queue.poll();
        System.out.print(tempNode.val + " ");
        
        if (tempNode.left != null) {
            queue.add(tempNode.left);
        }
        
        if (tempNode.right != null) {
            queue.add(tempNode.right);
        }
    }
}`,
        codeCpp: `void levelOrder(TreeNode* root) {
    if (root == NULL) return;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* tempNode = q.front();
        q.pop();
        cout << tempNode->val << " ";
        
        if (tempNode->left != NULL)
            q.push(tempNode->left);
            
        if (tempNode->right != NULL)
            q.push(tempNode->right);
    }
}`
    },
    {
        id: generateId(),
        title: 'Maximum Depth of Binary Tree',
        category: 'Binary Tree',
        difficulty: 'Easy',
        language: 'Java',
        description: 'Find the maximum depth (height) of a binary tree.',
        code: `public int maxDepth(TreeNode root) {
    if (root == null) {
        return 0;
    }
    
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    
    return Math.max(leftDepth, rightDepth) + 1;
}`,
        codeCpp: `int maxDepth(TreeNode* root) {
    if (root == NULL) return 0;
    
    int leftDepth = maxDepth(root->left);
    int rightDepth = maxDepth(root->right);
    
    return max(leftDepth, rightDepth) + 1;
}`
    }
];
