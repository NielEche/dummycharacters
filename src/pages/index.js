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

    if (loading) {
        return <Loading />;
    }

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
            <div className="project-list lg:grid grid-cols-2 gap-4 ">
                {projects.map((project) => {
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(project.cover);
                    const isPdf = /\.pdf$/i.test(project.cover);
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(project.cover);

                    return (
                        <div key={project.id} className="project-card pb-6 border-r-2 border-black px-6 pt-4">
                            <div className="flex justify-between">
                                <h2 className="project-title leading-tight menlo text-black font-black underline lg:pr-18 pr-6">{project.title}</h2>
                                <div className="flex justify-around">
                                {Array.isArray(project.field) && project.field.map((tag, index) => (
                                    <Link href={`/projects/${encodeURIComponent(tag)}`} className="fields" key={index}>
                                        <p className="WebButton WebButton2 mx-2 p-1">{tag}</p>
                                    </Link>
                                ))}

                                </div>
                            </div>
                            <div className="image-container text-xs text-black pb-6">
                                <p className="project-date py-6 leading-tight"> {project.about && documentToReactComponents(project.about)}</p>
                                {isImage && (
                                    <Image
                                        src={formatImageUrl(project.cover)}
                                        alt={`${project.title} cover`}
                                        width={250}
                                        height={250}
                                        className="project-image object-contain"
                                    />
                                )}

                                {isPdf && (
                                    <iframe
                                        src={`${formatImageUrl(project.cover)}#view=FitH`}
                                        width="250"
                                        height="250"
                                        className="project-pdf-preview object-contain"
                                        title={`${project.title} PDF Preview`}
                                    />
                                )}
                                {isVideo && (
                                    <video
                                        width="250"
                                        height="250"
                                        controls
                                        className="project-video-preview object-contain"
                                    >
                                        <source src={formatImageUrl(project.cover)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                            <div className="flex justify-between py-4">
                                <button 
                                    onClick={() => handleMoreClick(project)} 
                                    className="WebButton WebButton2 mx-2 p-1"
                                >
                                    More
                                </button>
                                <p className="text-black mx-2 text-xs py-1 px-2">Share</p>
                            </div>

                            {/* Additional images section */}
                            {expandedProject === project.id && project.images && (
                                <div className="additional-images grid grid-cols-2 gap-2 py-6">
                                    {project.images.map((mediaUrl, index) => {
                                        // Determine if the mediaUrl should be treated as an image or video
                                        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(mediaUrl);
                                        const isPdf = /\.pdf$/i.test(mediaUrl);
                                        const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);

                                        return (
                                            <div key={index} className="relative">
                                                {isVideo ? (
                                                    <video
                                                        width={150}
                                                        height={150}
                                                        controls
                                                        className="project-video-preview cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)} // Handle video click as needed
                                                    >
                                                        <source src={mediaUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : isImage ? (
                                                    <Image
                                                        src={formatImageUrl(mediaUrl)} // You may need to adjust formatImageUrl to handle direct downloads
                                                        alt={`Image ${index + 1} from ${project.title}`}
                                                        width={150}
                                                        height={150}
                                                        className="project-image cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)} // Open modal on image click
                                                    />
                                                ) : (
                                                    <p className="text-red-500">Unsupported media type: {mediaUrl}</p> // Show unsupported type with URL
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <hr className="border-black py-2"></hr>
                        </div>
                    );
                })}
            </div>

            <div className="sound-section px-6 text-black lg:w-[38rem]">
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
