import { TimeagoClock } from "ngx-timeago";
import { interval, Observable } from "rxjs";

export class MyClock extends TimeagoClock {
    // ticks every 2s
    tick(then: number): Observable<number> {
        return interval(6 * 10 * 10 * 100);
    }
}