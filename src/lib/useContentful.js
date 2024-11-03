import { createClient } from 'contentful';
import { useEffect, useState, useCallback } from 'react';

const useContentful = () => {
    const client = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
        host: "https://cdn.contentful.com"
    });

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aboutRecord, setAboutRecord] = useState(null);
    const [loadingAbout, setLoadingAbout] = useState(true);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [sound, setSound] = useState([]);
    const [loadingSound, setLoadingSound] = useState(true);

    const getHomeContent = useCallback(async () => {
        try {
            const entries = await client.getEntries({
                content_type: 'home',
                select: 'fields.about',
            });
            if (entries.items.length > 0) {
                setRecords(entries.items[0].fields.about);
            }
        } catch (error) {
            console.error("Error Fetching Home Content:", error);
        } finally {
            setLoading(false);
        }
    }, [client]);

    const getAboutContent = useCallback(async () => {
        try {
            const entries = await client.getEntries({
                content_type: 'about',
                select: 'fields.bio',
            });
            if (entries.items.length > 0) {
                setAboutRecord(entries.items[0].fields.bio);
            }
        } catch (error) {
            console.error("Error Fetching About Content:", error);
        } finally {
            setLoadingAbout(false);
        }
    }, [client]);

    const getProjects = useCallback(async () => {
        try {
            const entries = await client.getEntries({
                content_type: 'projects',
                select: 'fields.title,fields.field,fields.date,fields.about,fields.cover,fields.images',
            });

    
            const sanitizedEntries = entries.items.map((item) => ({
                id: item.sys.id,
                title: item.fields.title, // Correctly assigning the title
                field: item.fields.field, // Assigning to a different key
                date: item.fields.date, // Assigning to a different key
                about: item.fields.about,
                cover: item.fields.cover?.fields.file.url,
                images: item.fields.images?.map(image => image.fields.file.url) || [],
            }));

          sanitizedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
            setProjects(sanitizedEntries);
        } catch (error) {
            console.error("Error Fetching Projects:", error);
        } finally {
            setLoadingProjects(false);
        }
    }, [client]);


    const getSoundContent = useCallback(async () => {
        try {
            const entries = await client.getEntries({
                content_type: 'sound',
                select: 'fields.links,sys.createdAt',  // Include createdAt for sorting
            });
    
            // Sort by createdAt in ascending order (oldest first)
            const sortedEntries = entries.items.sort((a, b) => new Date(a.sys.createdAt) - new Date(b.sys.createdAt));
    
            const sanitizedEntries = sortedEntries.map((item) => ({
                id: item.sys.id,
                links: item.fields.links,
            }));
    
            setSound(sanitizedEntries);
        } catch (error) {
            console.error("Error Fetching Sound:", error);
        } finally {
            setLoadingSound(false);
        }
    }, [client]);
    

    useEffect(() => {
        getHomeContent();
        getAboutContent();
        getProjects();
        getSoundContent();
    }, [getHomeContent, getAboutContent, getProjects, getSoundContent]);

    return {
        records,
        loading,
        aboutRecord,
        loadingAbout,
        projects,
        loadingProjects,
        sound,
        loadingSound

    };
};

export default useContentful;