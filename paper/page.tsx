"use client"
import React, { ChangeEvent, useState } from 'react'
import assets from "./assets/upload.svg"
import axios from 'axios';

function page() {

  const [loading, setLoading] = useState<any>(false);
  const [url, setUrl] = useState<any>("")

  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }


  function UploadInput() {
    return (
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray"
        >
          <div className="flex flex-col items center-justify pt-5 pb-6">
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload</span> or drag and drop
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input id="dropzone-file" onChange={uploadImage} type="file" className='hidden' />
        </label>
      </div>
    )
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const base64 = await convertBase64(file);
    setLoading(true)

    axios
      .post("http://localhost:5001/v1/user/uploadimage", { image: base64 })
      .then((res) => {
        setUrl(res.data)
        alert("Image selected successfully")
      })
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false)
        console.log({ err })
      })
  }

  return (
    <div className="flex justify-center flex-col m-8">
      {url && (
        <div>
          Access your file at {" "}
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </div>
      )}
      <div>
        {loading ?
          <div className="flex items-center justify-center">
            <img src={assets} />{" "}
          </div> :
          <UploadInput />
        }
      </div>
    </div>
  )
}

export default page