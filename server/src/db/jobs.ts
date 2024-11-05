import { connection } from './connection.js';
import { generateId } from './ids.js';

const getJobTable = () => connection.table('job');

export async function getJobs(limit,offset) {

  let query = getJobTable().select().orderBy('createdAt','desc');
  if(limit){
    query.limit(limit)
  }
  if(offset){
    query.offset(offset)
  }
  return await query
}
export async function countJobs() {
  const { count }:any = await getJobTable().first().count('* as count');
  return count;
}



export async function getJob(id,companyId) {
  let obj:any = {id}
  if(companyId !== null){
    obj.companyId = companyId
  }
  return await getJobTable().first().where(obj);
}


export async function getJobsByCompanyId(companyId) {
  return await getJobTable().select().where({companyId});
}

export async function createJob({ companyId, title, description }) {
  const job = {
    id: generateId(),
    companyId,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  await getJobTable().insert(job);
  return job;
}

export async function deleteJob(id) {
  await getJobTable().delete().where({ id });
  return true;
}

export async function updateJob({ id, title, description }) {
  const job = await getJobTable().first().where({ id });
  if (!job) {
    throw new Error(`Job not found: ${id}`);
  }
  const updatedFields = { title, description };
  await getJobTable().update(updatedFields).where({ id });
  return { ...job, ...updatedFields };
}
