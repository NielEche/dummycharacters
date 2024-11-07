import Image from "next/legacy/image";
import Link from 'next/link';
import "../partials/home.css";
import Loading from '../app/components/Loading';
import useContentful from '../lib/useContentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useState } from 'react';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';


const Home = () => {
    const { loading, projects, sound } = useContentful();
    const [selectedProject, setSelectedProject] = useState(null);
    const [expandedProject, setExpandedProject] = useState(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    const options = {
        renderNode: {
          [INLINES.HYPERLINK]: (node) => (
            <a href={node.data.uri} target="_blank" className="underline" rel="noopener noreferrer">
              {node.content[0].value}
            </a>
          ),
        },
      };
      

    const formatImageUrl = (url) => {
        if (typeof url !== 'string' || !url) return ''; 
        return url.startsWith('http') ? url : `https:${url}`;
    };

    const handleMoreClick = (project) => {
        setExpandedProject(prev => prev === project.id ? null : project.id);
    };

    const handleImageClick = (image) => {
        setSelectedProject(image);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    const toggleShareOptions = (project) => {
        setCurrentProject(project);
        setShowShareOptions(prev => !prev);
    };

    const getShareLinks = () => {
        if (!currentProject) return {};
        
        const projectUrl = `https://dummy-characters.space`; // Set to your site's homepage or a relevant page
        const title = encodeURIComponent(currentProject.title);
        const imageUrl = encodeURIComponent(formatImageUrl(currentProject.cover));

        return {
            twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(projectUrl)}&via=niel_eche&image=${imageUrl}`,
            instagram: `https://www.instagram.com/share?url=${projectUrl}`, // Instagram does not support direct link sharing
        };
    };

    return (
        <div className='py-10 lg:px-4 px-2 lg:flex justify-between bggray'>
            <div className="project-list lg:grid grid-cols-2 gap-4">
                {loading ? (
                    <Loading />
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="project-card pb-6 border-r-2 border-black px-6 pt-4">
                            <div className="flex justify-between">
                                <h2 className="project-title leading-tight menlo text-black font-black underline lg:pr-18 pr-6">{project.title}</h2>
                                <div className="flex justify-around">
                                    {Array.isArray(project.field) && project.field.map((tag) => (
                                        <Link href={`/projects/${encodeURIComponent(tag)}`} className="fields" key={tag}>
                                            <p className="WebButton WebButton2 mx-2 p-1">{tag}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            
                            <div className="project-date py-6 text-black text-sm leading-tight">
                            {project.about && documentToReactComponents(project.about, options)}
                            </div>
                            
                            {/* Display cover image */}
                            {project.cover && (
                                <div className="image-container text-xs text-black">
                                    <Image
                                        src={formatImageUrl(project.cover)}
                                        alt={`${project.title} cover`}
                                        width={300}
                                        height={300}
                                        className="project-image object-contain"
                                    />
                                </div>
                            )}
                            
                            <div className="flex justify-between py-4">
                                <div>
                                    <button 
                                        onClick={() => handleMoreClick(project)} 
                                        className="WebButton WebButton2 mx-2 p-1">
                                        {expandedProject === project.id ? 'Less' : 'More'}
                                    </button> 
                                </div>
                            
                                <div className="relative">
                                    <button onClick={() => toggleShareOptions(project)} className="text-sm mx-2 p-1 text-black">
                                        Share <span className="text-xl">&#x2197;</span> 
                                    </button>
                                    {showShareOptions && currentProject === project && (
                                        <div className="absolute bg-white shadow-lg border text-sm rounded p-2">
                                            {getShareLinks().twitter && (
                                                <a href={getShareLinks().twitter} target="_blank" rel="noopener noreferrer" className="block text-blue-500">Share on Twitter</a>
                                            )}
                                            {/*<span className="block text-pink-500">Copy the link and share on Instagram</span>*/}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional images section */}
                            {expandedProject === project.id && project.images && (
                                <div className="additional-images grid grid-cols-2 gap-2 py-6">
                                    {project.images.map((mediaUrl, index) => {
                                        const isVideo = mediaUrl.includes("videos.ctfassets.net");
                                        const isImage = mediaUrl.includes("images.ctfassets.net");

                                        return (
                                            <div key={index} className="relative">
                                                {isVideo ? (
                                                    <video
                                                        width={150}
                                                        height={150}
                                                        controls
                                                        className="project-video-preview object-contain cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)}
                                                    >
                                                        <source src={mediaUrl} type="video/mp4" />
                                                    </video>
                                                ) : isImage ? (
                                                    <Image
                                                        src={formatImageUrl(mediaUrl)}
                                                        alt={`Image from ${project.title}`}
                                                        width={150}
                                                        height={150}
                                                        className="project-image object-contain cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)}
                                                    />
                                                ) : (
                                                    <p className="text-red-500">Unsupported media type</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <hr className="border-black py-2" />
                        </div>
                    ))
                )}
            </div>

            <div className="sound-section px-6 text-black lg:w-[85rem]">
                <h2 className="text-4xl font-bold underline mb-6">Sound</h2>
                <div className="sound-list grid grid-cols-1 gap-4">
                    {Array.isArray(sound) && sound.map((soundItem) => (
                        <div key={soundItem.id} className="py-2">
                            <div
                                className="iframe-container"
                                dangerouslySetInnerHTML={{ __html: soundItem.links }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for viewing individual images */}
            {selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg">
                        <div className="bio text-right">
                            <button onClick={closeModal} className="biobtn">X</button>
                        </div>
                        <div className="biodetails">
                            <Image
                                src={formatImageUrl(selectedProject)}
                                alt="Selected project image"
                                width={450}
                                height={450}
                                className="project-image object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
