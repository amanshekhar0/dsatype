import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const queueAlgorithms: AlgorithmSnippet[] = [
    {
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
}`,
        codeCpp: `class Queue {
    int front, rear, size;
    unsigned capacity;
    int* array;
public:
    Queue(unsigned capacity) {
        this->capacity = capacity;
        front = size = 0;
        rear = capacity - 1;
        array = new int[capacity];
    }
    ~Queue() { delete[] array; }
    
    bool isFull() {
        return (size == capacity);
    }
    
    bool isEmpty() {
        return (size == 0);
    }
    
    void enqueue(int item) {
        if (isFull()) return;
        rear = (rear + 1) % capacity;
        array[rear] = item;
        size = size + 1;
        cout << item << " enqueued to queue" << endl;
    }
    
    int dequeue() {
        if (isEmpty()) return INT_MIN;
        int item = array[front];
        front = (front + 1) % capacity;
        size = size - 1;
        return item;
    }
};`
    }
];
