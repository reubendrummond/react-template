import { useEffect, useState, createRef } from "react";
import { searchTwitter } from "utils/requests";
import { Card } from "./Card";

export const CardContainer = () => {
  const [query, setQuery] = useState(null);
  const [nextToken, setNextToken] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchBar = createRef();

  const getPosts = async (query) => {
    setIsLoading(true);
    const res = await searchTwitter(query);
    setIsLoading(false);
    if (!res.meta.result_count) {
      return [];
    }
    const posts = formatTwitterPosts(res);
    return posts;
  };

  useEffect(async () => {
    if (!query) return;
    const posts = await getPosts(query);
    setPosts(posts);
    // console.log(posts);
  }, [query]);

  const formatTwitterPosts = (searchTwitterResponse) => {
    const { data: rawPosts, includes, meta } = searchTwitterResponse;

    setNextToken(meta.next_token);
    const { users, media } = includes;

    const posts = rawPosts.map((post) => {
      const authorModified = users.find((user) => {
        return user.id === post.author_id;
      });
      const mediaModified = post.attachments
        ? post.attachments.media_keys.map((media_key) => {
            return media.find((m) => {
              return m.media_key === media_key;
            });
          })
        : [];

      // 'text' now an array of objects with regular text and mentions
      const mentions = post.entities ? post.entities.mentions : null;
      const text = post.text;

      const textArray = [];
      let prevEnd = 0;
      if (mentions) {
        mentions.forEach((mention) => {
          textArray.push({
            text: text.slice(prevEnd, mention.start),
          });
          textArray.push({
            text: text.slice(mention.start, mention.end),
            mention: users.find((user) => {
              return user.username === mention.username;
            }),
          });
          prevEnd = mention.end;
        });
      }
      textArray.push({ text: text.slice(prevEnd) });

      return {
        author: authorModified,
        media: mediaModified,
        textArray: textArray,
      };
    });
    return posts;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.querySelector("#query").value;
    setQuery(query);
  };

  const reset = () => {
    setQuery(null);
    setPosts(null);
    setNextToken(null);
    searchBar.current.value = null;
  };

  const refresh = async () => {
    setPosts(null);
    const posts = await getPosts(query);
    setPosts(posts);
  };

  const loadMore = async () => {
    setIsLoading(true);
    const res = await searchTwitter(query, nextToken);
    const newPosts = formatTwitterPosts(res);
    setIsLoading(false);
    setPosts([...posts, ...newPosts]);
  };

  return (
    <div className="w-[300px] relative">
      <h1 className="text-2xl">
        {query ? `Search: ${query}` : "Search Twitter!"}
      </h1>
      <form onSubmit={handleSearch}>
        <div className="p-2 border-2 flex focus-within:border-blue-300 justify-between gap-2">
          <input
            ref={searchBar}
            type="text"
            id="query"
            placeholder="Seach..."
            className="focus:outline-none w-full autofill:bg-white"
          />
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              className="hover:fill-blue-300"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
      </form>
      {posts && (
        <button className="absolute right-0" onClick={reset}>
          Reset
        </button>
      )}
      {query && (posts || isLoading) && (
        <button className="block mx-auto my-2" onClick={refresh}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
      )}
      {posts &&
        posts.map((post, index) => {
          return <Card post={post} key={index} />;
        })}
      {posts && !posts.length && <div>No results for &apos;{query}&apos;</div>}
      {posts &&
        posts.length !== 0 &&
        (!isLoading ? (
          <svg
            className="hover:cursor-pointer hover:fill-blue-300 m-auto"
            onClick={loadMore}
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        ) : (
          <svg
            className="fill-blue-300 m-auto"
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        ))}
    </div>
  );
};
