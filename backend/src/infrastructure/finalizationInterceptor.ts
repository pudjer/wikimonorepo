import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
} from '@nestjs/common';
import { Observable, from, throwError } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { Transaction } from 'neo4j-driver';
import { NEO4J_TRANSACTION_TOKEN } from '../tokens';

@Injectable()
export class Neo4jTransactionInterceptor implements NestInterceptor {
  constructor(
      @Inject(NEO4J_TRANSACTION_TOKEN)
      private readonly tx: Transaction,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((data) =>
        from(this.tx.commit()).pipe(
          map(() => data),
        ),
      ),
      catchError((err) =>
        from(this.tx.rollback()).pipe(
          concatMap(() => throwError(() => err)),
        ),
      ),
    );
  }
}