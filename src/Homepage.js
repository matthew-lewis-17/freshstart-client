import './App.css';
import { AiOutlineGithub, AiFillLinkedin } from 'react-icons/ai'
import {SiKaggle} from 'react-icons/si'

//About page with project links at bottom
function Homepage() {
  return (
      <>
    <div className="flex flex-col gap-6">
        <div className="text-5xl text-black font-extrabold text-center">
            Looking to find a new place to settle down? FreshStart can help you find your new home!
        </div>
        <div className="rounded-lg text-2xl text-black font-extrabold text-center">
            Filter this detailed data set to find the perfect landing spot for you and your family. Discover affordable counties that fit all of your needs. Find the perfect place to raise your kids!
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