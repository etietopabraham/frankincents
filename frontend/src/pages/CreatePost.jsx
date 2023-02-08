import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { FormField, Loader } from '../components'

import { getRandomPrompts } from '../utils/';


const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    prompt: '',
    photo: ''
  });

  const [generatingImage, setGeneratingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if(form.prompt){
      try {
        setGeneratingImage(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt.toString() }),
        }) 

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });

      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImage(false);
      }
    } else{
      alert('Please enter a prompt')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(form.email && form.prompt && form.photo){
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
    
        if (response.ok) {
          const result = await response.json();
          navigate('/');
        }
         else {
          alert('There was an error saving the post');
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }else{
      alert('Please enter email, enter a prompt and generate an image');
    }
    
  }

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: [e.target.value] })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomPrompt })
  }

  return (
    <section className='max-w-7xl mx-auto'>
    {/* Hero section */}
      <div>
        <h1 className='font-extrabold text-[#ffffff] text-[32px]'> Create </h1>
        <p className='mt-2 text-[#00ff00] text-[16px] max-w[500px]'>
          Create & Share Artistic Wonders from OpenAI's DALL.E
        </p>
      </div>

      {/* Form Interface */}
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
          <div>
            <FormField 
              labelName = "Your email"
              type = "email"
              name = "email"
              placeholder = "Your email"
              value = {form.email}
              handleChange = {handleChange}
            />
            
            <FormField 
              labelName = "Prompt"
              type = "text"
              name = "prompt"
              placeholder = "A boy eating dog meat at mary slessor road in calabar Nigeria"
              value = {form.prompt}
              handleChange = {handleChange}
              isSurpriseMe
              handleSurpriseMe = {handleSurpriseMe}
            />

          <div className="relative bg-gray-50 border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 h-64 p-3 flex justify-center items-center">
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
              ) : (
                <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40" />
              )}

              {generatingImage && (
                <div className="absolute inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
          </div>
          </div>
          
      <div className="mt-5 flex gap-5">
        <button
          type="button"
          onClick={generateImage}
          className = "text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {generatingImage ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="mt-10">
        <p className="mt-2 text-[#666e75] text-[14px]">Share your generated artistic wonder with the community.</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with Community'}
          </button>
      </div>

      </form>
    </section>
  );
}

export default CreatePost