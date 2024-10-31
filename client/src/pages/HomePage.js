import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks.js';
import PaginationBar from '../components/PaginationBar.js';

const JOBS_PER_PAGE = 2;

function HomePage() {

  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error }
    = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);


  if (loading) {
    return <div> Loading.....</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs.items} />
      <PaginationBar currentPage={currentPage} totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default HomePage;
