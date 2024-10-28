
import {  getJobs,getJob, getJobsByCompanyId, createJob, deleteJob, updateJob} from "./db/jobs.js";

import {  getCompany} from "./db/companies.js";
import { GraphQLError } from "graphql";

export const resolvers ={

    Query : {
        jobs:  () => getJobs(),
        job:async (_root , {id} )=> {
            
            const job = await getJob(id,null)

            if(!job){
                throw notFoundErr('No job found Err.'+id)
            }

            return job
        },
        company:async (_root , {id} )=> {

            const company = await getCompany(id)

            if(!company){
                throw notFoundErr('No company found Err.'+id)
            }

            return company
        },
    },

    Mutation:{
        createJob:(_root,{input:{title,description}},{user})=>{
            console.log('------user',user)
            if(!user){
                throw unAuthorized('Unauthorized user.')
            }
            const companyId= user.companyId;

            return createJob({companyId,title,description})
        },
        deleteJob:async (_root,{id},{user})=> {


            if(!user){
                throw unAuthorized('Unauthorized user.')
            }

            const job = await getJob(id,user.companyId)

            if(!job){
                throw notFoundErr('No job found Err.'+id)
            }
            await deleteJob(id)
            return job
        },
        updateJob:async (_root,{input:{id,title,description}}) => {

            if(!user){
                throw unAuthorized('Unauthorized user.')
            }

            const job = await getJob(id,user.companyId)

            if(!job){
                throw notFoundErr('No job found Err.'+id)
            }
            await updateJob({id,title,description})
            return { ...job, ...{ title, description } };
        }
    },

    Company:{
        jobs: (company) => getJobsByCompanyId(company.id),
    },
    Job:{
        company:(job)=>  getCompany(job.companyId),
       date : (job)=>  job.createdAt.slice(0,10)
    }
};

function notFoundErr(message) {
   return new GraphQLError(message , {
        extensions :{
            code: 'NOT_FOUND'
        } 
    })
}
function unAuthorized(message) {
    return new GraphQLError(message , {
         extensions :{
             code: 'UNAUTHORIZED'
         } 
     })
 }