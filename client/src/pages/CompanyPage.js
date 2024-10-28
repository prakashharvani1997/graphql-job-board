import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  const [company, setCompany] = useState();

  useEffect(
    () => {
      getCompany(companyId).then(data => setCompany(data));
    },
    [companyId]
  );

  if (!company) {
    return <div> Loading.....</div>;
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>

      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
