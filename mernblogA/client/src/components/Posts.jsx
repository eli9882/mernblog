import React, { useEffect, useState, useRef } from 'react';
import PostItem from './PostItem';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente en true
  const arrowRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
        if (response?.data) {
          setPosts(response.data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.log(error);
        setPosts([]);
      }
      setIsLoading(false); // Cambia a false después de la carga de datos
    };

    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    responsive: [
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 530,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container id='post'>
      <section className="posts" id="blogs">
        <h2 className="section-heading spost">Blog</h2>
        {isLoading ? (
           <h2 className="center-text">Cargando..</h2>
        ) : posts.length ? (
          <>
            <Testimonials>
              <Slider ref={arrowRef} {...settings}>
                {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
                  <div key={id}>
                    <PostItem
                      postID={id}
                      thumbnail={thumbnail}
                      category={category}
                      title={title}
                      description={description}
                      authorID={creator}
                      createdAt={createdAt}
                    />
                  </div>
                ))}
              </Slider>
              <Buttons>
                <button onClick={() => arrowRef.current.slickPrev()}><IoIosArrowBack /></button>
                <button onClick={() => arrowRef.current.slickNext()}><IoIosArrowForward /></button>
              </Buttons>
            </Testimonials>
          </>
        ) : (
          <h2 className="center-text">No se han encontrado publicaciones.</h2>
        )}
      </section>
    </Container>
  );
};

export default Posts;

const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 4rem 0;

  @media(max-width:840px){
    width: 90%;
  }

  span{
    font-weight: 700;
    text-transform: uppercase;
  }
  .slick-list, .slick-slider, .slick-track{
    padding: 0;
  }

  .slick-dots{
    text-align: left;
    margin-left: 1rem;
  }

  .slick-dots li button:before{
    content: "";
  }

  .slick-dots li button{
    width: 9px;
    height: 4px;
    background: linear-gradient(159deg, rgb(45, 45, 58) 0%, rgb(43, 43, 53) 100%);
    padding: 0.1rem;
    margin-top: 1rem;
    transition: all 400ms ease-in-out;
    border-radius: 50px;
  }
  
  .slick-dots li.slick-active button{
    background:  #228be6;
    width: 15px;
  }

  .slick-dots li{
    margin: 0;
  }
`;

const Testimonials = styled.div`
  margin-top: 2rem;
  position: relative;
`;

const Buttons = styled.div`
  position: absolute;
  right: 0.7rem;
  bottom: -2rem;

  button{
    background-color: transparent;
    margin-left: 0.5rem;
    border: none;
    color: #228be6;
    cursor: pointer;
    font-size: 1.1rem;
  }

  @media(max-width:530px){
    display: none;
  }
`;
