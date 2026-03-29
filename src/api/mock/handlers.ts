import { http, HttpResponse } from 'msw';
import users from './users.json';
import companies from './companies.json';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(users);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(user);
  }),

  http.get('/api/companies', () => {
    return HttpResponse.json(companies);
  }),

  http.get('/api/companies/:id', ({ params }) => {
    const { id } = params;
    const company = companies.find(c => c.id === id);
    
    if (!company) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(company);
  }),

  http.get('/api/companies', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      const userCompanies = companies.filter(company => 
        company.users?.includes(userId)
      );
      return HttpResponse.json(userCompanies);
    }
    
    return HttpResponse.json(companies);
  }),
];