// lib/useContentful.js
import { useEffect, useState } from 'react';
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const useContentful = () => {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'home', // Fetch entries of type 'home'
          select: 'fields.about', // Select only the 'about' field
        });
        
        if (response.items.length > 0) {
          // Assuming there's one "home" entry, and we get the 'about' field
          setRecords(response.items[0].fields.about);
        } else {
          console.error("No records found for content type 'home'.");
        }
      } catch (error) {
        console.error("Error fetching data from Contentful:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return { records, loading };
};

export default useContentful;
