import { Injectable, Logger } from '@nestjs/common';
import { ActionFactory } from 'src/actions/action-factory';
import { ExecuteDecisionTreeDto } from 'src/dto/execute-decision-tree.dto';
import { ExecutionContext } from 'src/execution/execution-context';
@Injectable()
export class DecisionService {
    private readonly logger = new Logger(DecisionService.name);
  
    async executeTree(dto: ExecuteDecisionTreeDto): Promise<void> {
      const rootAction = ActionFactory.fromJson(dto.tree);
  
      const ctx: ExecutionContext = {
        date: dto.context?.date,
        variables: dto.context?.variables ?? {},
      };
  
      this.logger.log('Starting decision tree execution');
      await rootAction.execute(ctx);
      this.logger.log('Decision tree execution finished');
    }
  }
