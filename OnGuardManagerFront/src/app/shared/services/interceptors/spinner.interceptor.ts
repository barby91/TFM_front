import { inject } from "@angular/core"
import { SpinnerServiceService } from "../../../services/spinner/spinner-service.service"
import { finalize } from "rxjs";
import { HttpInterceptorFn } from "@angular/common/http";

export const spinnerInterceptor:HttpInterceptorFn = (req, next) =>{
    const spinnerService = inject(SpinnerServiceService);

    spinnerService.show();
    return next(req).pipe(
        finalize(() => spinnerService.hide())
    )
}