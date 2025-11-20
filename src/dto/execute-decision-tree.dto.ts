export class ExecuteDecisionTreeDto {
    // root of the tree
    tree: any;
  
    // optional context (for example, for expression)
    context?: {
      date?: string;
      variables?: Record<string, any>;
    };
  }
  