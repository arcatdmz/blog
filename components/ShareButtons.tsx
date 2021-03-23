import { FC } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";
import { Label } from "semantic-ui-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
  hashtag: string;
  twitterAccount: string;
}

const ShareButtons: FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  hashtag,
  twitterAccount
}) => {
  return (
    <p className="share">
      <Label content="SNSで共有" basic />
      <FacebookShareButton
        url={url}
        quote={description}
        hashtag={`#${hashtag}`}
      >
        <FacebookIcon size={40} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        via="TextAliveJp"
        hashtags={[hashtag]}
        related={["TextAliveJp"]}
      >
        <TwitterIcon size={40} round />
      </TwitterShareButton>
      <LineShareButton url={url} title={title}>
        <LineIcon size={40} round />
      </LineShareButton>
    </p>
  );
};

export { ShareButtons };
