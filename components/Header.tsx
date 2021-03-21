import { FC } from "react";


const Header: FC = () => (<>
    <div className="ui right sidebar inverted vertical menu">
        <a className="item" href="/ja/">
            <img className="ui avatar image" src="/images/junkato.jpg"/>トップ
        </a>
        <a className="item" href="/ja/#contact">
            <i className="address card icon"></i>
            連絡先
        </a>
        <a className="item" href="/ja/projects">
            <i className="lab icon"></i>
            プロジェクト
        </a>
        <a className="item" href="/ja/publications">
            <i className="text file icon"></i>
            発表文献
        </a>
        <a className="item" href="/ja/design">
            <i className="paint brush icon"></i>
            デザイン
        </a>
        <a className="item" href="/ja/activities">
            <i className="student icon"></i>
            職務活動
        </a>
        <a className="item" href="/ja/timeline">
            <i className="history icon"></i>
            活動履歴
        </a>
        <a className="item" href="/ja/collaborations">
            <i className="handshake icon"></i>
            共同研究
        </a>
        <a className="item" href="/ja/blog">
            <i className="wordpress icon"></i>
            ブログ
        </a>
        <a className="item" href="/">
            <i className="translate icon"></i>
            English
        </a>
    </div>
    <div className="ui top fixed menu" id="fixed-menu">
        <a className="item" href="/ja/">
            <span className="mobile hidden">加藤 淳</span>
            <span className="print-hidden mobile only">
                <i className="user icon"></i>
            </span>
        </a>
        <a className="mobile hidden item" href="/ja/#contact">
            <i className="address card icon"></i>
            <span className="print-hidden tablet or lower hidden">連絡先</span>
        </a>
        <a className="ui print-hidden mobile hidden item" href="/ja/projects">
            <i className="lab icon"></i>
            <span className="tablet or lower hidden">プロジェクト</span>
        </a>
        <a className="mobile hidden item" href="/ja/publications">
            <i className="text file icon"></i>
            <span className="print-hidden tablet or lower hidden">発表文献</span>
        </a>
        <a className="mobile hidden item" href="/ja/design">
            <i className="paint brush icon"></i>
            <span className="print-hidden computer or lower hidden">デザイン</span>
        </a>
        <a className="mobile hidden item" href="/ja/activities">
            <i className="student icon"></i>
            <span className="print-hidden computer or lower hidden">職務活動</span>
        </a>
        <a className="mobile hidden item" href="/ja/timeline">
            <i className="history icon"></i>
            <span className="print-hidden computer or lower hidden">活動履歴</span>
        </a>
        <a className="mobile hidden item" href="/ja/collaborations">
            <i className="handshake icon"></i>
            <span className="print-hidden computer or lower hidden">共同研究</span>
        </a>
        <div className="right menu">
            <a className="item" href="/ja/blog">
                <i className="wordpress icon"></i>
                <span className="print-hidden tablet or lower hidden">ブログ</span>
            </a>
            <a className="item" href="/">
                <i className="translate icon"></i>
                <span className="print-hidden">English</span>
            </a>
            <a className="item print-hidden sidebar-button" href="#">
                <i className="sidebar icon"></i>
                <span className="widescreen monitor only">メニュー</span>
            </a>
        </div>
    </div>
</>);

export default Header;