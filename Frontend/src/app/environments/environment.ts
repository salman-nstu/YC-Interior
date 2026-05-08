// LOCAL: Development environment
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',  // LOCAL: Spring Boot on localhost (no /api - services add their own prefix)
  fileBaseUrl: 'http://localhost:8080'   // LOCAL: File uploads from localhost
};
