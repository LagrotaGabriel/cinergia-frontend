import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzI4Mzg2MH0.1cgjT5qQsS0ezMNsdD6vF9J9eJbUUoOPqxv3270bzmKKH7dKVuvyySUZC79JD3nSRnfZwvIktg4ttbt_z0T9KQ'
    : '	Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzI5MDg5Mn0.K2vtfDIEawgCVOjlQCIs2XTkQIt8h-jBqsXyL-awCqKk-evIrQFyEnCG76N1K7_KLeg0YHTQ0KZSZUKrIJTPlg'
}

// import { isDevMode } from '@angular/core';
// export const API_CONFIG = {
//     baseUrl: 'https://cinergia-backend.herokuapp.com/api/v1',
//     devToken: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4Njc3MDIwOX0.48VcPydrAHMKMG_wpOieG7NTgDfx1WvC72IapuTcsjuZMoi_aw36WHSxT6nm8bZsPwEa9L_DTY7ijq357G3WUQ'
// }