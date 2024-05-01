import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class customerInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('token', token);
    const newClone = req.clone({
      setHeaders: {Authorization: `${token}`} 
    });
    console.log('newClone', newClone);
    return next.handle(newClone);
  }
}