import Header from "../components/Header.jsx";
import ComicCard from "../components/ComicCard.jsx";
import ComicSlider from "../components/ComicSlider.jsx";
import Footer from "../components/Footer.jsx";

const featuredComics = [
    { id: 1, title: "Mafia Nanny", info: "An amazing journey", img: "https://swebtoon-phinf.pstatic.net/20231117_39/17001732047764nikV_JPEG/6LandingPage_mobile.jpg?type=crop540_540" },
    { id: 2, title: "Remarrying Empress", info: "A thrilling mystery", img: "https://swebtoon-phinf.pstatic.net/20241227_86/1735266265695KWSnx_JPEG/6EpisodeList_Mobile.jpg?type=crop540_540" },
    { id: 3, title: "Osora", info: "A war of heroes", img: "https://swebtoon-phinf.pstatic.net/20240306_260/17096640577543NJdu_JPEG/2EpisodeList_Mobile.jpg?type=crop540_540" },
];

const categorizedComics = {
    Thriller: [
        { id: 1, title: "MonnChild", info: "A chilling thriller", img: "https://swebtoon-phinf.pstatic.net/20230330_148/16801133831178Narn_JPEG/4MoonChild_landingpage_mobile.jpg?type=crop540_540" },
        { id: 2, title: "Flawless", info: "Spooky horror story", img: "https://swebtoon-phinf.pstatic.net/20210909_276/16311248916778Ngga_JPEG/9Flawless_mobile_landingpage.jpg?type=crop540_540" },
        { id: 3, title: "Bastard", info: "A suspenseful ride", img: "https://swebtoon-phinf.pstatic.net/20150608_96/1433732722146JfafB_JPEG/EC9E91ED9288EC8381EC84B8_mobile.jpg?type=crop540_540" },
        { id: 10, title: "Pigpen", info: "A terrifying tale", img: "https://swebtoon-phinf.pstatic.net/20190930_20/1569807080506qVedb_PNG/M_details_720x1230.png?type=crop540_540" },
        { id: 11, title: "Ghost Teller", info: "A mystery romance", img: "https://swebtoon-phinf.pstatic.net/20180209_260/1518136656996FmwcK_JPEG/04_EC9E91ED9288EC8381EC84B8_mobile.jpg?type=crop540_540" },
    ],
    Romance: [
        { id: 4, title: "Mafia Nanny", info: "A beautiful romance", img: "https://swebtoon-phinf.pstatic.net/20231117_39/17001732047764nikV_JPEG/6LandingPage_mobile.jpg?type=crop540_540" },
        { id: 5, title: "I am the Villain", info: "Love and heartbreak", img: "https://swebtoon-phinf.pstatic.net/20230613_250/1686617788231dwzq0_JPEG/6ImTheVillain_landingpage_mobile.jpg?type=crop540_540" },
        { id: 6, title: "Your Smile is A Trap", info: "A tale of love", img: "https://swebtoon-phinf.pstatic.net/20210128_247/161177526160483XQK_JPEG/804_EC9E91ED9288EC8381EC84B8_mobile+28229.jpg?type=crop540_540" },
        { id: 12, title: "When Jasy Whistles", info: "Hidden feelings", img:"https://swebtoon-phinf.pstatic.net/20210721_218/1626812540060fgeCY_JPEG/8WhenJasyWhistlesLaunch_mobile_landingpage.jpg?type=crop540_540" },
        { id: 13, title: "Lore Olympus", info: "A dreamy romance", img: "https://swebtoon-phinf.pstatic.net/20200802_207/1596323527203ga6Fa_JPEG/04_EC9E91ED9288EC8381EC84B8_mobile.jpg?type=crop540_540" },
    ],
    Action: [
        { id: 7, title: "Eleceed", info: "Epic battles ahead", img: "https://swebtoon-phinf.pstatic.net/20210410_276/1618006860453g7PCa_JPEG/804_EC9E91ED9288EC8381EC84B8_mobile.jpg?type=crop540_540" },
        { id: 8, title: "Omniscient Reader", info: "Fast and furious", img: "https://swebtoon-phinf.pstatic.net/20230524_52/1684869003058mtNYU_JPEG/5OmniscientReader_landingpage_mobile.jpg?type=crop540_540" },
        { id: 9, title: "Tower Of God", info: "A high-stakes battlefield", img: "https://swebtoon-phinf.pstatic.net/20230324_114/1679612146968KhLLz_JPEG/6TowerOfGod_landingpage_mobile.jpg?type=crop540_540" },
        { id: 14, title: "Return Of The Crazy Demon", info: "A tale of vengeance", img: "https://swebtoon-phinf.pstatic.net/20220531_168/16539796309869zrkc_JPEG/49Mobile2BDetail2BBanner_23c3004e.jpg?type=crop540_540" },
        { id: 15, title: "Lookism", info: "A team of rebels", img: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84141dc39fde7bca1786541cd3" },
    ],
};


export default function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-between relative">
            <Header />
            <main className="flex-grow flex flex-col items-center px-1">
                <ComicSlider comics={featuredComics} />

                <div className="w-full max-w-6xl space-y-4">
                    {Object.entries(categorizedComics).map(([category, comics]) => (
                        <section key={category} className="w-full">

                            <h2 className="text-2xl font-bold mb-1 font-nunito py-3">{category}</h2>
                            <hr className="border-gray-300 mb-3" />


                            <div className="grid grid-cols-5 gap-7 auto-rows-fr">
                                {comics.map((comic) => (
                                    <ComicCard key={comic.id} comic={comic} className="w-full h-full" />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
