import Image from "next/image";
import Link from 'next/link';
import "../partials/home.css";
import Loading from '../app/components/Loading';
import useContentful from '../lib/useContentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useState } from 'react';

const Home = () => {
    const { loading, projects, sound } = useContentful();
    const [selectedProject, setSelectedProject] = useState(null);
    const [expandedProject, setExpandedProject] = useState(null);



    const formatImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `https:${url}`;
    };

    const handleMoreClick = (project) => {
        // Toggle the expanded project
        setExpandedProject(prev => prev === project.id ? null : project.id);
    };

    const handleImageClick = (image) => {
        setSelectedProject(image);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <div className='py-10 lg:px-4 px-2 lg:flex justify-between'>
          
        </div>
    );
};

export default Home;
