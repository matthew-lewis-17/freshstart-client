import './App.css';
import { AiOutlineGithub, AiFillLinkedin } from 'react-icons/ai'
import {SiKaggle} from 'react-icons/si'

//About page with project links at bottom
function Homepage() {
  return (
      <>
    <div className="flex flex-col gap-6">
        <div className="text-5xl text-black font-extrabold text-center">
            Looking to escape the Bay Area or Seattle? FreshStart is what you're looking for!
        </div>
        <div className="rounded-lg bg-slate-300 text-2xl text-black font-extrabold text-center opacity-80">
            Filter our detailed data set to find the perfect landing spot for you and your family. Discover affordable counties that fit all of your needs. Find the perfect place to raise your kids!
        </div>
        <div className="rounded-lg bg-slate-300 text-base text-black text-center opacity-80">
            *This is v1.0.0 of this project, which is my first foray into JS, React, and full stack web development. Please reach out to me on LinkedIn or Github with any bug fixes, recommendations, ideas, or even entry level SWE positions that would be a good fit for me!
        </div>
        <div className='grid grid-cols-3 gap-4 place-items-center'>
            <div className='hover:opacity-75'>
                <a href="https://github.com/MLenterprises/freshstart-client" target="_blank"><AiOutlineGithub size={70}/></a>
            </div>
            <div className='hover:opacity-75'>
                <a href="https://www.linkedin.com/in/matthew-lewis-239608170/" target="_blank"><AiFillLinkedin size={70}/></a>
            </div>
            <div className='hover:opacity-75'>
                <a href="https://www.kaggle.com/datasets/matthewlewis17/freshstart-v1-data" target="_blank"><SiKaggle size={70}/></a>
            </div>
        </div>
    </div>
    </>
  );
}

export default Homepage;