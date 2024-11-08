import { useRouter } from 'next/router';
import useContentful from '../../lib/useContentful';
import Loading from '../../app/components/Loading';
import Link from 'next/link';
import Image from "next/legacy/image";
import logoImage from '../../assets/DC3DTRANS.gif';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useState } from 'react';
import "../../partials/home.css";

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

    const formatImageUrl = (url) => url ? (url.startsWith('http') ? url : `https:${url}`) : '';

    const handleMoreClick = (projectId) => {
        setExpandedProject(prev => prev === projectId ? null : projectId);
    };

    const handleImageClick = (image) => {
        setSelectedProject(image);
    };

    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <div className="py-6 text-black">
            <nav className="py-6 px-2">
                <ul>
                    <li className="headLogo">
                        <Link href="/">
                            <Image src={logoImage} alt="Home" width={130} height={130} />
                            <span className="underline">&larr; Back to home</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <h1 className="text-lg px-4 font-black pb-6 text-right">
                Projects Tagged: <span className="capitalize">{tag}</span>
            </h1>
            <hr className="border-black" />

            <div className="project-list lg:grid grid-cols-3 gap-4 bggray">
                {filteredProjects.map((project) => {
                    const { id, title, field, about, cover, images } = project;
                    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(cover);
                    const isPdf = /\.pdf$/i.test(cover);
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(cover);

                    return (
                        <div key={id} className="project-card pb-6 border-r-2 border-black px-6 pt-6">
                            <div className="flex justify-between">
                                <h2 className="project-title leading-tight menlo text-xs font-black underline lg:pr-18 pr-8">
                                    {title}
                                </h2>
                                <div className="flex">
                                    {field?.map((tag, index) => (
                                        <Link key={index} href={`/projects/${encodeURIComponent(tag)}`}>
                                            <p className="WebButton mx-2 text-xs py-1 px-2">{tag}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="text-xs text-black pb-6">
                                <div className="project-date py-6">{about && documentToReactComponents(about)}</div>
                                {isImage && (
                                    <Image
                                        src={formatImageUrl(cover)}
                                        alt={`${title} cover`}
                                        width={250}
                                        height={250}
                                        className="project-image object-contain"
                                    />
                                )}
                                {isPdf && (
                                    <iframe
                                        src={`${formatImageUrl(cover)}#view=FitH`}
                                        width="250"
                                        height="250"
                                        className="project-pdf-preview object-contain"
                                        title={`${title} PDF Preview`}
                                    />
                                )}
                                {isVideo && (
                                    <video width="250" height="250" controls className="project-video-preview object-contain">
                                        <source src={formatImageUrl(cover)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>

                            <div className="flex justify-between py-4">
                                <button 
                                    onClick={() => handleMoreClick(id)} 
                                    className="WebButton mx-2 text-xs py-1 px-2"
                                >
                                    More
                                </button>
                                <p className="text-black mx-2 text-xs py-1 px-2">Share</p>
                            </div>

                            {expandedProject === id && images && (
                                <div className="additional-images grid grid-cols-2 gap-2 py-6">
                                    {images.map((mediaUrl, index) => {
                                        const isVideo = mediaUrl.includes("videos.ctfassets.net");
                                        const isImage = mediaUrl.includes("images.ctfassets.net");
                                        const isPDF = mediaUrl.endsWith(".pdf");

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
                                                        alt={`Image ${index + 1} from ${title}`}
                                                        width={150}
                                                        height={150}
                                                        className="project-image object-contain cursor-pointer"
                                                        onClick={() => handleImageClick(mediaUrl)}
                                                    />
                                                ) : isPDF ? (
                                                    <iframe
                                                        src={mediaUrl}
                                                        width={150}
                                                        height={150}
                                                        className="project-pdf object-contain cursor-pointer"
                                                        title={`PDF from ${project.title}`}
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
