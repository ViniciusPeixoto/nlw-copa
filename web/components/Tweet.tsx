import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

interface TweetProps {
  text: string;
}

export function Tweet(props: TweetProps) {
  return (
    <div>
      <h1>Tweet</h1>
      <p>{props.text}</p>
      <button>Like</button>
    </div>
  )
}