import { FC, useContext } from "react";
import { Header, Image } from "semantic-ui-react";
import { BlogContext } from "../../lib/BlogContext";

interface AboutProps {
  inverted?: boolean;
}

const About: FC<AboutProps> = ({ inverted = false }) => {
  const { language, author } = useContext(BlogContext);
  return (
    <>
      <Header
        as="h4"
        inverted={inverted}
        dividing
        content={language === "ja" ? "このブログについて" : "About this blog"}
      />
      {language === "ja" ? (
        <p>
          人とコンピュータの関係を考え、よりよくしていく学問{" "}
          <strong>
            &quot;<abbr title="Human-Computer Interaction">HCI</abbr>&quot;
          </strong>{" "}
          研究者のブログです。<strong>創作支援</strong>のための
          <strong>ユーザインタフェース</strong>と<strong>統合環境</strong>
          設計を専門としています。
          <a href="https://www.aist.go.jp">
            <abbr title="国立研究開発法人 産業技術総合研究所">産総研</abbr>
          </a>
          という研究所と<a href="https://archinc.jp/">アーチ</a>
          というアニメ会社に所属しており、研究だけでなく、一般公開サービスの開発や運営も行っています。日々のこと、趣味のこと、いろいろ書きます。
        </p>
      ) : (
        <p>
          This blog is owned by an{" "}
          <strong>Human-Computer Interaction (HCI)</strong> researcher with
          focus on designing <strong>user interfaces</strong> and{" "}
          <strong>integrated environments</strong> for{" "}
          <strong>creativity support</strong>. Based in Tsukuba, Japan, he is a
          senior researcher at{" "}
          <a href="https://www.aist.go.jp/index_en.html">
            <abbr title="National Institute of Advanced Industrial Science and Technology">
              AIST
            </abbr>
          </a>
          , a national research organization, and the technical advisor at{" "}
          <a href="https://archinc.jp/en">Arch Inc.</a>, an animation production
          company. He writes research papers and blog posts, develops and
          manages web services, and helps creators.
        </p>
      )}
      <Header as="h5" inverted={inverted}>
        <img
          src="https://junkato.jp/images/junkato.jpg"
          className="ui avatar image"
          alt=""
        />
        {author}
      </Header>
      {language === "ja" ? (
        <p>
          著者について、詳しくは<a href="https://junkato.jp/ja">自己紹介</a>
          へどうぞ。
        </p>
      ) : (
        <p>
          For more details about the author, please refer to{" "}
          <a href="https://junkato.jp">the portfolio website</a>.
        </p>
      )}
    </>
  );
};

export { About };
