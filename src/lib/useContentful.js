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

    // Fetch with retry logic
    const fetchWithRetry = async (fetchFunc, retries = 3, delay = 1000) => {
        try {
            return await fetchFunc();
        } catch (error) {
            if (retries > 0) {
                console.warn(`Retrying... attempts left: ${retries}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchWithRetry(fetchFunc, retries - 1, delay * 2); // Exponential backoff
            } else {
                console.error("Error after retries:", error);
                throw error;
            }
        }
    };

    // Fetch functions for each content type
    const getHomeContent = useCallback(async () => {
        const entries = await client.getEntries({
            content_type: 'home',
            select: 'fields.about',
        });
        if (entries.items.length > 0) {
            setRecords(entries.items[0].fields.about);
        }
        setLoading(false);
    }, [client]);

    const getAboutContent = useCallback(async () => {
        const entries = await client.getEntries({
            content_type: 'about',
            select: 'fields.bio',
        });
        if (entries.items.length > 0) {
            setAboutRecord(entries.items[0].fields.bio);
        }
        setLoadingAbout(false);
    }, [client]);

    const getProjects = useCallback(async () => {
        const entries = await client.getEntries({
            content_type: 'projects',
            select: 'fields.title,fields.field,fields.date,fields.about,fields.cover,fields.images',
        });
        const sanitizedEntries = entries.items.map((item) => ({
            id: item.sys.id,
            title: item.fields.title,
            field: item.fields.field,
            date: item.fields.date,
            about: item.fields.about,
            cover: item.fields.cover?.fields.file.url,
            images: item.fields.images?.map(image => image.fields.file.url) || [],
        }));
        sanitizedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProjects(sanitizedEntries);
        setLoadingProjects(false);
    }, [client]);

    const getSoundContent = useCallback(async () => {
        const entries = await client.getEntries({
            content_type: 'sound',
            select: 'fields.links,sys.createdAt',
        });
        const sortedEntries = entries.items.sort((a, b) => new Date(a.sys.createdAt) - new Date(b.sys.createdAt));
        const sanitizedEntries = sortedEntries.map((item) => ({
            id: item.sys.id,
            links: item.fields.links,
        }));
        setSound(sanitizedEntries);
        setLoadingSound(false);
    }, [client]);

    // Sequential fetch with retry logic
    useEffect(() => {
        const fetchDataSequentially = async () => {
            try {
                await fetchWithRetry(getHomeContent);
                await fetchWithRetry(getAboutContent);
                await fetchWithRetry(getProjects);
                await fetchWithRetry(getSoundContent);
            } catch (error) {
                console.error("Final error in fetching data:", error);
            }
        };
        fetchDataSequentially();
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
