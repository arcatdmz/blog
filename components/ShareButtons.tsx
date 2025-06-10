import { FC } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";
import { Menu } from "semantic-ui-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtag?: string;
  twitterAccount?: string;
}

const ShareButtons: FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  hashtag,
  twitterAccount
}) => {
  return (
    <>
      <Menu.Item>
        <FacebookShareButton
          url={url}
          hashtag={hashtag ? `#${hashtag}` : undefined}
        >
          <FacebookIcon size={30} round />
        </FacebookShareButton>
      </Menu.Item>
      <Menu.Item>
        <TwitterShareButton
          url={url}
          title={title}
          via={twitterAccount}
          hashtags={hashtag ? [hashtag] : undefined}
          related={twitterAccount ? [twitterAccount] : undefined}
        >
          <TwitterIcon size={30} round />
        </TwitterShareButton>
      </Menu.Item>
      {/* <Menu.Item>
        <LineShareButton url={url} title={title}>
          <LineIcon size={30} round />
        </LineShareButton>
      </Menu.Item> */}
      <Menu.Item>
        <HatenaShareButton url={url} title={title}>
          <HatenaIcon size={30} round />
        </HatenaShareButton>
      </Menu.Item>
    </>
  );
};

export { ShareButtons };
