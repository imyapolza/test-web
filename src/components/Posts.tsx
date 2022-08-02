import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseUrl } from '../constants/fakeData';
import HeaderLayout from '../layouts/HeaderLayout';
import { useAppSelector } from '../redux/hooks';
import { setIsAuth } from '../redux/slices/user';
import fetchData from '../utils/fetchData';
import getCookie from '../utils/getCookie';
import getPosts from '../utils/getPosts';
import getUser from '../utils/getUser';
import Post from './Post';
import './styles/Posts.scss';
import randomInteger from '../utils/randomInteger';
import generatePosts from '../utils/generatePosts';

function Posts() {
  const dispatch = useDispatch();
  const isAuth = useAppSelector((state) => state.user.isAuth);

  const [posts, setPosts] = useState<any[]>([]);
  const [resultPosts, setResultPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (fetching) {
      generatePosts(currentPage, setCurrentPage, setPosts, setTotalCount, setFetching);
    }
  }, [fetching]);

  const scrollHandler = (e: any) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);

    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    const access_token = getCookie('access_token');

    getPosts(access_token)
      .then((res) => {
        if (res.data[0].isAuth) {
          dispatch(setIsAuth(true));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <HeaderLayout>
        {isAuth ? (
          <div className="posts">
            <div className="posts-wrapper">
              {posts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
          </div>
        ) : (
          <h2 className="alert">
            Эту страницу могут просматривать только авторизованные пользователи
          </h2>
        )}
      </HeaderLayout>
    </>
  );
}

export default Posts;
