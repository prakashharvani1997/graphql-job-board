
import { GraphQLClient ,gql} from "graphql-request";
import { getAccessToken } from "../auth";

const client = new GraphQLClient('http://localhost:9000/graphql',{headers:()=>{
    const accessToken = getAccessToken()

    if(accessToken){
        return {'Authorization':`Bearer ${accessToken}`}
    }
    return {}
}});


export async function getJobs() {

    const query = gql`
    query{
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
    `

   const {jobs}=await client.request(query);

   console.log('-------jobs',jobs)
   return jobs;
}


export async function createJob({title,description}) {

    const mutation = gql`
    mutation CreateJob($input:createJobInput!){
        job : createJob(input:$input) {
            id
        }
    }
    `

   const {job}=await client.request(mutation,{input:{title,description}});

   console.log('---create----job',job)
   return job;
}


export async function getJob(id) {

    const query = gql`
    query JobById($id: ID!){
        job (id:$id){
            id
            title
            date
            company {
                id
                name
            }
            description
        }
    }
    `

   const {job}=await client.request(query,{id});

   console.log('-------job',job)
   return job;
}




export async function getCompany(id) {
    console.log('---id----company',id)

    const query = gql`
    query CompanyById($id: ID!){
        company(id:$id){
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
    `

   const {company}=await client.request(query,{id});

   console.log('-------company',company)
   return company;
}


