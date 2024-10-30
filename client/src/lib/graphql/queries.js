import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache
} from "@apollo/client";

//
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({uri:"http://localhost:9000/graphql"});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  }

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache()
});



const jobDetailFragment =gql`
fragment JobDetail on Job{
    id
    title
    date
    company {
      id
      name
    }
    description
}
`

export const createJobMutation = gql`
mutation CreateJob($input: createJobInput!) {
  job: createJob(input: $input) {
    ...JobDetail
  }
}
${jobDetailFragment}
`;



export const JobByIdQuery = gql`
query JobById($id: ID!) {
  job(id: $id) {
   ...JobDetail
  }
}
${jobDetailFragment}
`;

export const CompanyByIdQuery = gql`
query CompanyById($id: ID!) {
  company(id: $id) {
    id
    name
    description
    jobs {
      id
      title
      date
    }
  }
}
`;

export const JobsQuery = gql`
query jobs{
  jobs {
   ...JobDetail
  }
}
${jobDetailFragment}
`;