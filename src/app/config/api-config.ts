import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? '	Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjIxODgyNjQzNyIsImV4cCI6MTY4NzQ1MTE1N30.u0UvttMpvNoR9NOQQklrn7hmwTx2B_K1o99nf0djDcIxX4KsaqMB6aTJh0_g_yCL76JG9Wsm_j_b4Zxlo96WGA'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NzM1OTQ5MX0.mIeyRc7zJ49zBqjBjwLOhV6fSsiTBXIgnu9MWvJ5WrleIkOHqIKxMvydlq5aQGRrJNJcfFSV8xVq2G-EtyGiqQ'
}