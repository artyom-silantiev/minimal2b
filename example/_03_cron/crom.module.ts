import { Logger } from 'minimal2b/logger';
import { defineModule } from 'minimal2b/module';
import {
  Cron,
  QueueJob,
  Schedule,
  ScheduleExpression,
} from 'minimal2b/schedule';

@Cron()
class CronService {
  counter1 = 0;
  counter2 = 0;

  constructor(private logger: Logger) {}

  @QueueJob(1000 * 5)
  delay5SecQueueJob() {
    this.logger.log('delay5SecQueueJob', this.counter1++);
  }

  @Schedule(ScheduleExpression.EVERY_10_SECONDS)
  ever10SecSchedule() {
    this.logger.log('ever10SecSchedule', this.counter2++);
  }
}

export const CronModule = defineModule((ctx) => {
  const moduleLogger = new Logger('CronModule');
  const cronService = new CronService(moduleLogger);

  ctx.useItems({ cronService });
});
