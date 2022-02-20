import { Fragment } from "react";

export const Card = ({ post }) => {
  const { author, media, textArray } = post;
  return (
    <div className="p-2 gap-2 justify-center max-w-sm">
      <div className="flex flex-row">
        <img
          className="rounded-full mr-2"
          src={author.profile_image_url}
          alt="profile image"
        />
        <div>
          <a
            href={`https://www.twitter.com/${author.username}`}
            target="_black"
          >
            {author.username}
          </a>
          <p className="text-sm text-gray-500">{author.name}</p>
        </div>
      </div>
      <div className="break-words">
        {textArray.map((text, index) => {
          return (
            <Fragment key={index}>
              {text.mention && text.mention.url ? (
                <a
                  className="font-bold"
                  href={text.mention.url}
                  target="_black"
                  key={index}
                >
                  {text.text}
                </a>
              ) : (
                <>{text.text}</>
              )}
            </Fragment>
          );
        })}
      </div>
      <div>
        {media &&
          media.map((m, index) => {
            {
              return m.type === "photo" ? (
                <img key={index} src={m.url} />
              ) : (
                <></>
              );
            }
          })}
      </div>
    </div>
  );
};
