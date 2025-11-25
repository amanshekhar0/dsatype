import { AlgorithmSnippet } from '../types';
import { generateId } from './utils';

export const moreSqlQueries: AlgorithmSnippet[] = [
    {
        id: generateId(),
        title: 'Select All Columns',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Select all columns from a table named "users".',
        code: `SELECT * FROM users;`
    },
    {
        id: generateId(),
        title: 'Select Specific Columns',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Select only the name and email columns from the "users" table.',
        code: `SELECT name, email FROM users;`
    },
    {
        id: generateId(),
        title: 'Where Clause',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Select users who are older than 18.',
        code: `SELECT * FROM users WHERE age > 18;`
    },
    {
        id: generateId(),
        title: 'Order By',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Select all users ordered by their creation date in descending order.',
        code: `SELECT * FROM users ORDER BY created_at DESC;`
    },
    {
        id: generateId(),
        title: 'Inner Join',
        category: 'SQL',
        difficulty: 'Medium',
        language: 'SQL',
        description: 'Select user names and their order details using an INNER JOIN.',
        code: `SELECT users.name, orders.order_date, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;`
    },
    {
        id: generateId(),
        title: 'Group By and Count',
        category: 'SQL',
        difficulty: 'Medium',
        language: 'SQL',
        description: 'Count the number of users in each country.',
        code: `SELECT country, COUNT(*) as user_count
FROM users
GROUP BY country;`
    },
    {
        id: generateId(),
        title: 'Left Join',
        category: 'SQL',
        difficulty: 'Medium',
        language: 'SQL',
        description: 'Select all users and their orders, including users with no orders.',
        code: `SELECT users.name, orders.id as order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id;`
    },
    {
        id: generateId(),
        title: 'Create Table',
        category: 'SQL',
        difficulty: 'Medium',
        language: 'SQL',
        description: 'Create a new table for storing products.',
        code: `CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0
);`
    },
    {
        id: generateId(),
        title: 'Insert Data',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Insert a new user into the users table.',
        code: `INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 25);`
    },
    {
        id: generateId(),
        title: 'Update Data',
        category: 'SQL',
        difficulty: 'Easy',
        language: 'SQL',
        description: 'Update the email of a user with a specific ID.',
        code: `UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;`
    }
];
