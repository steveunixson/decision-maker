import { Body, Controller, Post } from '@nestjs/common';
import { ExecuteDecisionTreeDto } from '../../dto/execute-decision-tree.dto';
import { DecisionService } from './decision.service';

@Controller('decision')
export class DecisionController {
    constructor(private readonly service: DecisionService) {}
  
    @Post('execute')
    async execute(@Body() dto: ExecuteDecisionTreeDto) {
      await this.service.executeTree(dto);
      return { status: 'ok' };
    }
  }
