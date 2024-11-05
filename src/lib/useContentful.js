import { useEffect, useState } from 'react';
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const useContentful = () => {
  const [homeRecord, setHomeRecord] = useState(null);
  const [projects, setProjects] = useState([]);
  const [sound, setSound] = useState([]); // State to hold sound entries
  const [bio, setBio] = useState(null); // State to hold bio data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the 'home' entry for the 'about' field
        const homeResponse = await client.getEntries({
          content_type: 'home',
          select: 'fields.about',
        });

        if (homeResponse.items.length > 0) {
          setHomeRecord(homeResponse.items[0].fields.about);
        } else {
          console.error("No records found for content type 'home'.");
        }

        // Fetch 'projects' entries with specified fields, sorted by date (descending)
        const projectsResponse = await client.getEntries({
          content_type: 'projects',
          select: 'fields.title,fields.field,fields.date,fields.about,fields.cover,fields.images',
          order: '-fields.date',
        });

        const projectItems = projectsResponse.items.map((item) => ({
          id: item.sys.id,
          title: item.fields.title,
          field: item.fields.field,
          date: item.fields.date,
          about: item.fields.about,
          cover: item.fields.cover?.fields.file.url || '',  // Access the cover image URL
          images: item.fields.images?.map(image => image.fields.file.url) || [], // Map through images for URLs
        }));

        setProjects(projectItems);

        // Fetch 'sound' entries with only the 'link' field, sorted by creation date (ascending)
        const soundResponse = await client.getEntries({
          content_type: 'sound',
          select: 'fields.links',
          order: 'sys.createdAt', // Sort by creation date in ascending order
        });

        const soundItems = soundResponse.items.map((item) => ({
          id: item.sys.id,
          links: item.fields.links,
        }));

        setSound(soundItems);

        // Fetch the 'about' entry to get the bio field
        const aboutResponse = await client.getEntries({
          content_type: 'about', // Adjust this to your actual content type ID for 'about'
          select: 'fields.bio',
        });

        if (aboutResponse.items.length > 0) {
          setBio(aboutResponse.items[0].fields.bio);
        } else {
          console.error("No records found for content type 'about'.");
        }

      } catch (error) {
        console.error("Error fetching data from Contentful:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { homeRecord, projects, sound, bio, loading }; // Return 'bio' in addition to other states
};

export default useContentful;
