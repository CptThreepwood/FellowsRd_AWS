import React from 'react';
import Slider from 'react-slick';
import SignInDialog from './SignInDialog';

import './slick.css';
import './slick-theme.css';

var shuffle = function(array) {
  let temp = [];
  for (var i = 0; i < array.length ; i++) {
    temp.push(array.splice(Math.floor(Math.random()*array.length),1));
  }
  return temp;
};

const opening_image = '/IMG_5049.jpg';

let images = shuffle([
  '/IMG_5060.jpg', '/IMG_5061.jpg', '/IMG_5063.jpg',
  '/IMG_5065.jpg', '/IMG_5068.jpg', '/IMG_5079.jpg',
  '/IMG_5098.jpg', '/IMG_5107.jpg', '/IMG_5109.jpg',
  '/IMG_5114.jpg', '/IMG_5123.jpg', '/IMG_5133.jpg',
  '/IMG_5136.jpg', '/IMG_5139.jpg', '/IMG_5144.jpg',
]);

const lowest = '/960_600_photos';
const medium = '/1440_900_photos';
const highest = '/1920_1200_photos';

const image_style = {
  maxWidth: '100%',
  maxHeight: '100%',
  height: 'auto'
}


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const renderSlides = this.props.renderSlides;

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
      <div>
        <SignInDialog/>
        <div class="splashSlides">
          <Slider {...settings}>
            {(window.innerWidth > 1440) ? (
              <div> <img src={process.env.PUBLIC_URL + highest + opening_image} style={image_style} /> </div>
            ) : ( (window.innerWidth > 1200) ? (
                <div> <img src={process.env.PUBLIC_URL + medium + opening_image} style={image_style} /> </div>
              ) : (
                <div> <img src={process.env.PUBLIC_URL + lowest + opening_image} style={image_style} /> </div>
              )
            )}
            {
              images.map(
                url => {return(
                  (window.innerWidth > 1440) ? (
                    <div> <img src={process.env.PUBLIC_URL + highest + url} style={image_style} /> </div>
                  ) : ( (window.innerWidth > 1200) ? (
                      <div> <img src={process.env.PUBLIC_URL + medium + url} style={image_style} /> </div>
                    ) : (
                      <div> <img src={process.env.PUBLIC_URL + lowest + url} style={image_style} /> </div>
                    )
                  )
                )}
              )
            }
          </Slider>
        </div>
      </div>
    );
  }
}