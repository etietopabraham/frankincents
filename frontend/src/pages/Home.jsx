import React, { useState, useEffect } from 'react'

import { Loader, Card, FormField } from '../components';

const RenderCards = ({data, title}) => {
  if(data?.length > 0){
    return (
      data.map((post) => (
        <Card key={post._id} {...post} />
      ))
    );
  }

  return(
    <h2 className='mt-5 font-bold text-[#ffffff] text-xl uppercase'>
      {title}
    </h2>
  );
};

const Home = () => {
  
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('https://frankincents.onrender.com/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.ok){
          
          const result = await response.json();
          setAllPosts(result.data.reverse());
          
        }else{
          alert("bad respose");
        }

      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();

  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((item) => item.email.split("@")[0].toLowerCase().includes(searchText.toLocaleLowerCase()) || item.prompt.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));

        setSearchedResults(searchResults);
      }, 500)
    );
  }

  return (
    <section className='max-w-7xl mx-auto'>
    {/* Hero section */}
      <div>
        <h1 className='font-extrabold text-[#ffffff] text-[32px]'> Naija Artistic Showcase </h1>
        <p className='mt-2 text-[#ffff00] text-[16px] max-w[500px]'>
          Generate Artistic Wonders of OpenAI's DALL.E
        </p>
      </div>

    {/* Form field component */}
      <div className='mt-16'>
        <FormField 
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search posts"
          value={searchText}
          handleChange = {handleSearchChange}
        />
      </div>

    
    <div className='mt-10'>
      {
        loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ):(
          <>
            {
              searchText && (
                <h2 className='font-medium text-[#ffffff] text-xl mb-3'>
                  Showing results for <span className='text-[#ffff00]'>{searchText}</span>
                </h2>
              )
            }

            {/* Render our images */}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {
                searchText ? (
                  <RenderCards 
                    data = {searchedResults}
                    title = "No images for your search"
                  />
                ) : (
                  <RenderCards 
                    data={allPosts}
                    title = "No posts found"
                  />
                )
              }
            </div>
          </>
        )
      }
    </div>
    </section>
  )
}

export default Home