import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {
Pagination,
PaginationContent,
PaginationEllipsis,
PaginationItem,
PaginationLink,
PaginationNext,
PaginationPrevious,
} from "@/components/ui/pagination";

import JobCard from "@/components/ui/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const JobListing = () => {
const [searchQuery, setSearchQuery] = useState("");
const [location, setLocation] = useState("");
const [company_id, setCompany_id] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const jobsPerPage = 10; // Set the number of jobs per page

const { isLoaded } = useUser();

const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

const {
  loading: loadingJobs,
  data: jobs,
  fn: fnJobs,
} = useFetch(getJobs, {
  location,
  company_id,
  searchQuery,
});

useEffect(() => {
  if (isLoaded) {
    fnCompanies();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isLoaded]);

useEffect(() => {
  if (isLoaded) fnJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isLoaded, location, company_id, searchQuery]);

const handleSearch = (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);

  const query = formData.get("search-query");
  if (query) setSearchQuery(query);
  setCurrentPage(1); // Reset to first page on search
};

const clearFilters = () => {
  setSearchQuery("");
  setCompany_id("");
  setLocation("");
  setCurrentPage(1); // Reset to first page on clearing filters
};

// Pagination logic
const indexOfLastJob = currentPage * jobsPerPage;
const indexOfFirstJob = indexOfLastJob - jobsPerPage;
const currentJobs = jobs?.slice(indexOfFirstJob, indexOfLastJob);

const totalPages = Math.ceil(jobs?.length / jobsPerPage);

const handleClick = (pageNumber) => {
  setCurrentPage(pageNumber);
};

if (!isLoaded) {
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
}

return (
  <div className="">
    <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
      Latest Jobs
    </h1>
    <form
      onSubmit={handleSearch}
      className="h-14 flex flex-row w-full gap-2 items-center mb-3"
    >
      <Input
        type="text"
        placeholder="Search Jobs by Title.."
        name="search-query"
        className="h-full flex-1  px-4 text-md"
      />
      <Button type="submit" className="h-full sm:w-28" variant="blue">
        Search
      </Button>
    </form>

    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={location} onValueChange={(value) => setLocation(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {State.getStatesOfCountry("IN").map(({ name }) => {
              return (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={company_id}
        onValueChange={(value) => setCompany_id(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {companies?.map(({ name, id }) => {
              return (
                <SelectItem key={name} value={id}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        className="sm:w-1/2"
        variant="destructive"
        onClick={clearFilters}
      >
        Clear Filters
      </Button>
    </div>

    {loadingJobs && (
      <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
    )}

    {loadingJobs === false && (
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentJobs?.length ? (
          currentJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            );
          })
        ) : (
          <div>No Jobs Found 😢</div>
        )}
      </div>
    )}

    {totalPages > 1 && (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handleClick(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={currentPage === index + 1}
                onClick={() => handleClick(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )}
  </div>
);
};

export default JobListing;
