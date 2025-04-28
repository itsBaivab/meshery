import { useGetEventFiltersQuery } from '../../rtk-query/notificationCenter';
import TypingFilter from '../TypingFilter';
import { SEVERITY, STATUS } from './constants';
import { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';

const useFilterSchema = () => {
  const { data } = useGetEventFiltersQuery();
  // State to store available author names
  const [availableAuthors, setAvailableAuthors] = useState([]);

  // Fetch unique authors from events when component mounts
  useEffect(() => {
    // Use the endpoint to fetch events and extract unique authors
    fetch('/api/system/events?page=0&pagesize=100')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.events) {
          // Extract unique authors from events
          const authors = new Set();
          data.events.forEach((event) => {
            if (event.user_id && event.actor) {
              authors.add(event.actor);
            }
            // Also add "Meshery" for system-generated events
            if (event.system_id) {
              authors.add('Meshery');
            }
          });
          setAvailableAuthors([...authors]);
        }
      })
      .catch((error) => console.error('Error fetching authors:', error));
  }, []);

  return {
    SEVERITY: {
      value: 'severity',
      description: 'Filter by severity',
      values: Object.values(SEVERITY),
    },

    STATUS: {
      value: 'status',
      description: 'Filter by status',
      values: Object.values(STATUS),
      multiple: false,
    },

    ACTION: {
      value: 'action',
      values: data?.action || [],
      description: 'Filter by type',
    },

    AUTHOR: {
      value: 'author',
      description: 'Filter by any user or system',
      values: availableAuthors, // Use the fetched author names
      values: availableAuthors, // Use the fetched author names
    },

    CATEGORY: {
      value: 'category',
      description: 'Filter by category',
      values: data?.category || [],
    },
  };
};

const Filter = ({ handleFilter }) => {
  const filterSchema = useFilterSchema();
  return (
    <TypingFilter
      handleFilter={handleFilter}
      filterSchema={filterSchema}
      defaultFilters={[
        {
          type: 'STATUS',
          value: 'unread',
          label: 'status: unread',
        },
      ]}
      placeholder="Filter Notifications"
    />
  );
};

export default Filter;
