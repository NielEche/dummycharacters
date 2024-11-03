import { useRouter } from 'next/router';
import useContentful from '../../lib/useContentful';
import Loading from '../../app/components/Loading';
import "../../partials/home.css";
import Link from 'next/link';
import Image from 'next/image';
import logoImage from '../../assets/DC3DTRANS.gif';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useState } from 'react';

const ProjectsByTag = () => {
    const router = useRouter();
    const { tag } = router.query; 
    const { loading, projects } = useContentful(); 
    const [expandedProject, setExpandedProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    if (loading) return <Loading />;

    const filteredProjects = projects.filter(project => 
        Array.isArray(project.field) && project.field.includes(tag)
    );

    const formatImageUrl = (url) => {
        if (!url) return '';
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

    return (
        <div className='py-6 lg:px-4 px-2 text-black'>
            <nav className="py-6 px-2">
                <ul>
                    <li className='headLogo'>
                    <Link href="/">
                        <Image src={logoImage} alt="Home" width={130} height={130} />
                        <span className='underline'>&larr; Back to home</span>
                    </Link>
                    </li>
                </ul>
            </nav>

            <h1 className="text-lg px-2 font-black pb-6 text-right">Projects Tagged: <span className='capitalize'>{tag}</span> </h1>
            <hr className='border-black'></hr>
            <div className="project-list lg:grid grid-cols-3 gap-4">
                {filteredProjects.map((project) => {
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(project.cover);
                    const isPdf = /\.pdf$/i.test(project.cover);
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(project.cover);

                    return (
                        <div key={project.id} className="project-card pb-6 border-r-2 border-black px-6 pt-6">
                            <div className="flex justify-between">
                                <h2 className="project-title leading-tight menlo text-xs text-black font-black underline lg:pr-18 pr-8">
                                    {project.title}
                                </h2>
                                <div className="flex justify-around">
                                    {Array.isArray(project.field) && project.field.map((tag, index) => (
                                        <Link href={`/projects/${encodeURIComponent(tag)}`} className="fields" key={index}>
                                            <p className="WebButton mx-2 text-xs py-1 px-2">{tag}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="image-container text-xs text-black pb-6">
                                <p className="project-date py-6 leading-tight">
                                    {project.about && documentToReactComponents(project.about)}
                                </p>
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
                                    className="WebButton mx-2 text-xs py-1 px-2"
                                >
                                    More
                                </button>
                                <p className="text-black mx-2 text-xs py-1 px-2">Share</p>
                            </div>

                            {expandedProject === project.id && project.images && (
                                <div className="additional-images grid grid-cols-2 gap-2 py-6">
                                    {project.images.map((mediaUrl, index) => {
                                        const isVideo = mediaUrl.includes("videos.ctfassets.net") && mediaUrl.endsWith("download");
                                        const isImage = mediaUrl.includes("images.ctfassets.net") && mediaUrl.endsWith("download");

                                        return (
                                            <div key={index} className="relative">
                                                {isVideo ? (
                                                    <video
                                                        width={150}
                                                        height={150}
                                                        controls
                                                        className="project-video-preview cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)}
                                                    >
                                                        <source src={mediaUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ) : isImage ? (
                                                    <Image
                                                        src={formatImageUrl(mediaUrl)}
                                                        alt={`Image ${index + 1} from ${project.title}`}
                                                        width={150}
                                                        height={150}
                                                        className="project-image cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)}
                                                    />
                                                ) : (
                                                    <p className="text-red-500">Unsupported media type: {mediaUrl}</p>
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

export default ProjectsByTag;
