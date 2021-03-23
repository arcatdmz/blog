import Link from "next/link";
import { FC } from "react";
import { Header, List, SemanticSIZES } from "semantic-ui-react";

interface PostsForStudentsProps {
  inverted?: boolean;
  size?: SemanticSIZES;
}

const PostsForStudents: FC<PostsForStudentsProps> = ({
  inverted,
  size = "small"
}) => {
  return (
    <>
      <Header
        as="h4"
        inverted={inverted}
        dividing
        content="学生向けおすすめ記事"
      />
      <List divided selection inverted={inverted} size={size}>
        <Link href="/ja/posts/2012-11-13-cs-phd-findings">
          <List.Item
            as="a"
            href="/ja/posts/2012-11-13-cs-phd-findings"
            content="コンピュータ科学の博士課程にきて初めて分かったこと4つ"
          />
        </Link>
        <Link href="/ja/posts/2015-06-29-cs-research-internship-abroad">
          <List.Item
            as="a"
            href="/ja/posts/2015-06-29-cs-research-internship-abroad"
            content="情報科学系 海外研究インターンのすすめ"
          />
        </Link>
        <Link href="/ja/posts/2014-07-19-japanese-ist-society-phd">
          <List.Item
            as="a"
            href="/ja/posts/2014-07-19-japanese-ist-society-phd"
            content="情報理工学系の産業界とアカデミアは今後どうしたらいいの？"
          />
        </Link>
        <Link href="/ja/posts/2016-03-16-ipsj-one-px-science-as-a-service">
          <List.Item
            as="a"
            href="/ja/posts/2016-03-16-ipsj-one-px-science-as-a-service"
            content="情報処理が科学を更新する（IPSJ-ONEに登壇しました）"
          />
        </Link>
        <Link href="/ja/posts/2015-09-26-is-cs-fellowship-application-from-japan">
          <List.Item
            as="a"
            href="/ja/posts/2015-09-26-is-cs-fellowship-application-from-japan"
            content="日本からでも応募できる情報科学系Fellowship"
          />
        </Link>
        <Link href="/ja/posts/2014-05-04-acm-student-research-competition">
          <List.Item
            as="a"
            href="/ja/posts/2014-05-04-acm-student-research-competition"
            content="ACM Student Research Competition参加のすすめ"
          />
        </Link>
        <Link href="/ja/posts/2014-07-27-acm-doctoral-symposium-consortium">
          <List.Item
            as="a"
            href="/ja/posts/2014-07-27-acm-doctoral-symposium-consortium"
            content="ACM Doctoral Symposium (Consortium) 参加のすすめ"
          />
        </Link>
        <Link href="/ja/posts/2016-12-22-acm-student-volunteers">
          <List.Item
            as="a"
            href="/ja/posts/2016-12-22-acm-student-volunteers"
            content="国際会議Student Volunteerのすすめ"
          />
        </Link>
      </List>
    </>
  );
};

export { PostsForStudents };
