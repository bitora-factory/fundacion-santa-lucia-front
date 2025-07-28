import { Subject } from "rxjs";
import { Directive } from "@angular/core";
import { takeUntil } from 'rxjs';

@Directive()
export abstract class AbstractComponent {

    protected destroy$ = new Subject<void>();

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
