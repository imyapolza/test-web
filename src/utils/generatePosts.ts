import React from 'react';
import randomInteger from './randomInteger';
import axios from 'axios';
import { IPhoto, IPost } from '../types/types';
import { IResult } from '../redux/types/data';

const generatePosts = (
  currentPage: number,
  setCurrentPage: (arg: any) => void,
  setPosts: (arg: Array<IPost>) => void,
  setTotalCount: (arg: number) => void,
  setFetching: (arg: boolean) => void,
) => {
  const userId = randomInteger(5, 15);
  const limit = randomInteger(5, 15);

  let URL1 = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${currentPage}`;
  let URL2 = `https://jsonplaceholder.typicode.com/users`;
  let URL3 = `https://jsonplaceholder.typicode.com/photos`;

  const promise1 = axios.get(URL1);
  const promise2 = axios.get(URL2);
  const promise3 = axios.get(URL3);

  Promise.all([promise1, promise2, promise3]).then((values) => {
    const newValues = values.map((curr) => curr.data);

    const posts = newValues[0];
    const users = newValues[1];
    const photos: Array<IPhoto> = newValues[2];

    const newPhotos = photos.reduce((acc: any, curr) => {
      acc[curr.albumId] ?? (acc[curr.albumId] = []);

      acc[curr.albumId].push(curr);
      return acc;
    }, {});

    const newPosts: Array<IResult> = posts.reduce((acc: any, post: IResult) => {
      const currUser = users.filter((user: any) => post.userId === user.id)[0];

      const randomIdPhoto = randomInteger(0, 49);

      post['username'] = currUser.username;
      post['company'] = currUser.company.name;
      post['photo'] = newPhotos[currUser.id][randomIdPhoto].url;

      acc.push(post);
      return acc;
    }, []);

    setCurrentPage((prev: number) => prev + 1);
    setPosts([...posts, ...newPosts]);
    setTotalCount(Number(values[0].headers['x-total-count']));
    setFetching(false);
  });
};

export default generatePosts;
