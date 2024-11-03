import useContentful from '../lib/useContentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Loading from '../app/components/Loading';
import "../partials/about.css";
import code from '../assets/code.GIF';

const AboutPage = () => {
    const { aboutRecord, loadingAbout } = useContentful();
    const { records, loading } = useContentful();

    if (loadingAbout || loading) {
        return <Loading />;
    }

    return (
        <div className="">
            <div className='px-6'>
                <div className="bio text-right">
                    <button className="biobtn"><span>X</span></button>
                </div>
                <div className="biodetails aboutBio lg:flex justify-between">
                    <div id="niel">
                        <p className="lg:pr-20">
                            {records && documentToReactComponents(records)}
                        </p>
                    </div>
                    <div className="text-center py-2">
                        <h3 className="marquee Amarquee"><span> Niel Eche™</span></h3>
                    </div>
                </div>
            </div>

            <ul className="menlo bg-black py-6 flex justify-end space-x-8 w-full ">
                <li className=''>
                    <Image className="fields" src={code} alt="code" width={120} height={120} />
                </li>
            </ul>

            <div className="text-center p-6 bg-black text-white lg:flex justify-between">
                <div className="px-6 aboutBio menlo text-sm lg:px-8 w-full text-left">
                    {aboutRecord && documentToReactComponents(aboutRecord)}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
