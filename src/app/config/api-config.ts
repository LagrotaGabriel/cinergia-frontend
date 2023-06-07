import { isDevMode } from '@angular/core';
export const API_CONFIG = {
    baseUrl: isDevMode() ? 'http://localhost:9090/api/v1' : 'https://cinergia-backend.herokuapp.com/api/v1',
    devToken: isDevMode() 
    ? 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4NjY4OTAwOX0.PlQAbwYaSSyW4XDL6FhQ2UigNE-j1hadhXEkmExntXd9GVXOGS_40J4RAejxJ8sGYTwZaDhKNyTXpf7OcI6-9A'
    : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjM0NTY3ODkxMSIsImV4cCI6MTY4Njc2ODgxOH0.HcFWx2yOejEqicewa2dLEMJbxoOtyApYaZGyqxTqdQfI-hcWVq09u1uHCD43mQdrdJ7928G5foG7ML8zIrFF-Q'
}