import React from 'react';
import Slider from 'react-slick';
import './slick.css';
import './slick-theme.css';

var shuffle = function(array) {
  let temp = [];
  for (var i = 0; i < array.length ; i++) {
    temp.push(array.splice(Math.floor(Math.random()*array.length),1));
  }
  return temp;
};

const opening_image = process.env.PUBLIC_URL + '/IMG_5049.jpg';

let images = shuffle([
  process.env.PUBLIC_URL + '/IMG_5060.jpg',
  process.env.PUBLIC_URL + '/IMG_5061.jpg',
  process.env.PUBLIC_URL + '/IMG_5063.jpg',
  process.env.PUBLIC_URL + '/IMG_5065.jpg',
  process.env.PUBLIC_URL + '/IMG_5068.jpg',
  process.env.PUBLIC_URL + '/IMG_5079.jpg',
  process.env.PUBLIC_URL + '/IMG_5098.jpg',
  process.env.PUBLIC_URL + '/IMG_5107.jpg',
  process.env.PUBLIC_URL + '/IMG_5109.jpg',
  process.env.PUBLIC_URL + '/IMG_5114.jpg',
  process.env.PUBLIC_URL + '/IMG_5123.jpg',
  process.env.PUBLIC_URL + '/IMG_5133.jpg',
  process.env.PUBLIC_URL + '/IMG_5136.jpg',
  process.env.PUBLIC_URL + '/IMG_5139.jpg',
  process.env.PUBLIC_URL + '/IMG_5144.jpg',
  // process.env.PUBLIC_URL + '/IMG_5053.jpg',
  // process.env.PUBLIC_URL + '/IMG_5073.jpg',
  // process.env.PUBLIC_URL + '/IMG_5078.jpg',
  // process.env.PUBLIC_URL + '/IMG_5093.jpg',
  // process.env.PUBLIC_URL + '/IMG_5142.jpg',
  // process.env.PUBLIC_URL + '/IMG_5145.jpg',
  // process.env.PUBLIC_URL + '/IMG_5146.jpg',
  // process.env.PUBLIC_URL + '/IMG_5148.jpg',
  // process.env.PUBLIC_URL + '/IMG_5158.jpg',
  // process.env.PUBLIC_URL + '/IMG_5162.jpg',
  // process.env.PUBLIC_URL + '/IMG_5169.jpg',
  // process.env.PUBLIC_URL + '/IMG_5170.jpg'
]);

const image_style = {
  maxWidth: '100%',
  maxHeight: '100%',
  height: 'auto'
}


export default class extends React.Component {
  render() {
    console.log(images);
    const settings = {
      fade: true,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: false,
      
      slidesToShow: 1,
      slidesToScroll: 1,
      width: 600,
    };

    return (
      <Slider {...settings}>
        <div> <img src={opening_image} style={image_style} /> </div>
        {
          images.map(
            url => <div> <img src={url} style={image_style} /> </div>
          )
        }
      </Slider>
    );
  }
}