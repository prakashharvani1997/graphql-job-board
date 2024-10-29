import { GraphQLClient } from "graphql-request";
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

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache()
});

export async function getJobs() {
  const query = gql`
    query jobs{
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;
  const { data: { jobs } } = await apolloClient.query({ query
    ,
    fetchPolicy:'network-only'
   });
  console.log("-------jobs", jobs);
  return jobs;
}

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: createJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;
  const { data: { job } } = await apolloClient.mutate({
    mutation,
    variables: {
      input: { title, description }
    },
    update:(cache,{data})=>{

        cache.writeQuery({
            query:JobByIdQuery,
            variables:{
                id:data.job.id
            },
            data
        })
    }
  });

  console.log("---create----job", job);
  return job;
}

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

const JobByIdQuery = gql`
query JobById($id: ID!) {
  job(id: $id) {
   ...JobDetail
  }
}
${jobDetailFragment}
`;

export async function getJob(id) {

  const { data: { job } } = await apolloClient.query({
    query:JobByIdQuery,
    variables: {
      id
    }
  });
  console.log("-------job", job);
  return job;
}

export async function getCompany(id) {
  console.log("---id----company", id);

  const query = gql`
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
  const { data: { company } } = await apolloClient.query({
    query,
    variables: {
      id
    }
  });
  console.log("-------company", company);
  return company;
}