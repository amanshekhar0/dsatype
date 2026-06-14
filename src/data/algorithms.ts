import { AlgorithmSnippet } from '../types';
import { moreArrayAlgorithms } from './arrays';
import { graphAlgorithms } from './graphs';
import { dpAlgorithms } from './dp';
import { stackAlgorithms } from './stacks';
import { queueAlgorithms } from './queues';
import { treeAlgorithms } from './trees';
import { moreSqlQueries } from './sql';
import { companyQuestions } from './companies';

export const algorithmData: AlgorithmSnippet[] = [
    ...moreArrayAlgorithms,
    ...graphAlgorithms,
    ...dpAlgorithms,
    ...stackAlgorithms,
    ...queueAlgorithms,
    ...treeAlgorithms,
    ...moreSqlQueries,
    ...companyQuestions,
];