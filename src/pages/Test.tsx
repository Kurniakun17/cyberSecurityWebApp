import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Test = () => {
  const { register, handleSubmit } = useForm();
  const [multipleImages, setMultipleImages] = useState([]);
  const onSubmit = async () => {
    const images = multipleImages;
    console.log({ images });
    // console.log({ images: [data.images] });
    const res = await axios.put(
      'http://localhost:3000/template/bc3f45b1-1450-42d3-90dd-a566ddc11a0e/checklist/3ad58cf1-0f0d-44eb-a6c1-7b5e37c7c8e4',
      { images: multipleImages }
    );
    console.log(res.data);
  };

  const changeMultipleFiles = (e) => {
    console.log(e.target.files);
    if (e.target.files) {
      const imageArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setMultipleImages((prevImages) => prevImages.concat(imageArray));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex ">
      <div className="mt-20">
        <label htmlFor="inputFile" className="block w-fit">
          <div className="grid content-center h-8 w-8 border border-dashed border-blue-400">
            <p className="m-auto">+</p>
          </div>
        </label>
        <input
          {...register('images')}
          type="file"
          name=""
          className="hidden "
          multiple={true}
          id="inputFile"
          accept="image/*"
          onChange={changeMultipleFiles}
        />
        <div className="flex gap-4">
          {multipleImages.length > 0 ? (
            multipleImages.map((path) => (
              <div key={path}>
                <img
                  src={path}
                  alt=""
                  className="aspect-video h-[72px] object-cover "
                />
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <button>submit</button>
      </div>
    </form>
  );
};

export default Test;
